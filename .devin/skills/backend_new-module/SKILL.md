---
name: backend_new-module
description: Step-by-step guide to add a new feature module to a NestJS + GraphQL + TypeORM backend, including where each piece lives, the patterns to follow, and all shared utilities involved.
---

# Adding a New Module

This guide documents the exact steps and patterns used in this codebase to create a full CRUD GraphQL module (entity, types, DTOs, service, resolver, module, registration).

---

## Directory Structure

```
nestjs-api/src/
├── shared/
│   ├── data/
│   │   ├── types/
│   │   │   ├── {module}/
│   │   │   │   ├── {myEnum}.model.ts        ← enum definition
│   │   │   │   └── index.ts                 ← re-export
│   │   │   └── index.ts                     ← add export here
│   │   └── entities/
│   │       ├── {module}/
│   │       │   └── {entity}.entity.ts       ← TypeORM + GraphQL entity
│   │       └── index.ts                     ← add export here
└── modules/
    └── {module}/
        ├── {module}.module.ts
        ├── domain/
        │   └── {module}.service.ts
        └── view/
            ├── {module}.resolver.ts
            └── dto/
                ├── input/
                │   ├── create{Entity}.input.ts
                │   ├── update{Entity}.input.ts
                │   └── find{Entities}.args.ts
                └── output/
                    └── paginated{Entities}.output.ts
```

---

## Step 1 — Enum Type (if needed)

**File:** `shared/data/types/{module}/{myEnum}.model.ts`

```typescript
import { registerEnumType } from "@nestjs/graphql";

export enum MyStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

registerEnumType(MyStatus, {
  name: "MyStatus",
  description: "Status of a ...",
});
```

**File:** `shared/data/types/{module}/index.ts`

```typescript
export { MyStatus } from "./myStatus.model";
```

**Then add to:** `shared/data/types/index.ts`

```typescript
export { MyStatus } from "./{module}";
```

---

## Step 2 — Entity

**File:** `shared/data/entities/{module}/{entity}.entity.ts`

Every entity **must extend `BaseEntity`** from `src/shared/data/entities/baseEntity`. `BaseEntity` automatically provides:

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Auto-increment PK (not exposed via GraphQL) |
| `guid` | `UUID` | Public identifier, indexed, `@Field()` |
| `createdDate` | `Date` | `GraphQLTimestamp` |
| `updatedDate` | `Date` | `GraphQLTimestamp` |
| `createdBy` | `User` | Nullable relation |
| `updatedBy` | `User` | Nullable relation |
| `deletedDate` | `Date` | Set on soft-delete |

The class carries **both** `@Entity()` (TypeORM) and `@ObjectType()` (GraphQL) decorators.

```typescript
import { ObjectType, Field, Float } from "@nestjs/graphql";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { IsNotEmpty, IsEnum } from "class-validator";
import { BaseEntity } from "../baseEntity";
import { User } from "../users/user.entity";
import { Client } from "../clients/client.entity";
import { MyStatus } from "../../types/{module}/myStatus.model";
import { AddressOutput } from "../../types/users/address.model";

@Entity()
@ObjectType()
export class MyEntity extends BaseEntity {

  getLocalizedName?(): string {
    return 'Mi Entidad';         // used in NotFoundException messages
  }

  @Field()
  @IsNotEmpty()
  @Column("text", { unique: true })
  humanReadableId: string;

  @Field(() => MyStatus)
  @IsEnum(MyStatus)
  @Column({ type: "enum", enum: MyStatus, default: MyStatus.PENDING })
  status: MyStatus;

  @Field()
  @IsNotEmpty()
  @Column("text")
  name: string;

  @Field()
  @Column("date")
  dueDate: Date;

  @Field(() => Float)
  @Column("float")
  budget: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  optionalFlag?: boolean;

  // FK relation pattern — always eager: false
  @Field(() => Client)
  @ManyToOne(() => Client, { eager: false })
  @JoinColumn()
  client: Client;

  @Column()
  clientId: number;

  // JSONB column (e.g. address)
  @Field(() => AddressOutput)
  @Column("jsonb")
  clientAddress: AddressOutput;
}
```

**Then add to:** `shared/data/entities/index.ts`

```typescript
export { MyEntity } from "./{module}/myEntity.entity";
```

---

## Step 3 — DTOs

### 3a. Create Input

**File:** `modules/{module}/view/dto/input/create{Entity}.input.ts`

```typescript
import { InputType, Field, Float } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AddressInput } from "src/shared/data/types/users/address.model";

@InputType()
export class CreateMyEntityInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  budget: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  clientGuid: string;      // always pass guid, never id

  @Field(() => AddressInput)
  @ValidateNested()
  @Type(() => AddressInput)
  clientAddress: AddressInput;
}
```

### 3b. Update Input

**File:** `modules/{module}/view/dto/input/update{Entity}.input.ts`

All fields optional except `guid`. Include `status` if status transitions via `updateX`.

```typescript
import { InputType, Field, Float } from "@nestjs/graphql";
import { IsOptional, IsNumber, IsString, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { AddressInput } from "src/shared/data/types/users/address.model";
import { MyStatus } from "src/shared/data/types/{module}/myStatus.model";

@InputType()
export class UpdateMyEntityInput {
  @Field()
  @IsString()
  guid: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientGuid?: string;

  @Field(() => AddressInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInput)
  clientAddress?: AddressInput;

  @Field(() => MyStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MyStatus)
  status?: MyStatus;
}
```

### 3c. Find Args

**File:** `modules/{module}/view/dto/input/find{Entities}.args.ts`

Uses `FindGenericsWithNoPublicFiltersInput` (filters field is not exposed publicly in GraphQL schema).

```typescript
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsEnum, IsString } from "class-validator";
import { FindGenericsWithNoPublicFiltersInput } from "src/shared/presentation/dto/input/findGenerics.input";
import { MyStatus } from "src/shared/data/types/{module}/myStatus.model";

@InputType()
class FindMyEntitiesFilter {
  @Field(() => MyStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MyStatus)
  status?: MyStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  agentGuid?: string;

  @Field({ nullable: true })
  @IsOptional()
  dateFrom?: Date;

  @Field({ nullable: true })
  @IsOptional()
  dateTo?: Date;
}

@InputType()
export class FindMyEntitiesArgs extends FindGenericsWithNoPublicFiltersInput(FindMyEntitiesFilter) {
  @Field(() => FindMyEntitiesFilter, { nullable: true })
  @IsOptional()
  filters?: FindMyEntitiesFilter;
}
```

> Use `FindGenericsInput` instead if you want `filters` to be part of the public GraphQL schema.

### 3d. Paginated Output

**File:** `modules/{module}/view/dto/output/paginated{Entities}.output.ts`

```typescript
import { ObjectType } from "@nestjs/graphql";
import { MyEntity } from "src/shared/data/entities/{module}/myEntity.entity";
import { PaginatedList } from "src/shared/presentation/dto/output/paginated-list.output";

@ObjectType()
export class PaginatedMyEntities extends PaginatedList(MyEntity) {}
```

This gives `{ data: MyEntity[], count: number }` automatically.

---

## Step 4 — Service

**File:** `modules/{module}/domain/{module}.service.ts`

### Constructor

```typescript
@Injectable()
export class MyEntitiesService {
  constructor(
    @InjectRepository(MyEntity)
    private readonly myEntityRepository: IBaseRepository<MyEntity>,
    @InjectRepository(Client)
    private readonly clientsRepository: IBaseRepository<Client>,
    @InjectRepository(User)
    private readonly usersRepository: IBaseRepository<User>,
    private readonly customQuery: RepositoryCustomQueryService,
  ) {}
```

### findAll — Paginated Query

```typescript
async findAll(findArgs: FindMyEntitiesArgs): Promise<PaginatedMyEntities> {
  // 1. Pull out custom filters that need manual handling
  const { agentGuid, clientGuid, dateFrom, dateTo, ...remainingFilters } = findArgs.filters || {};

  // 2. Handle sort columns that map to joined table fields
  const sortColumn = findArgs.sort.column;
  const jsonbSortMap: Record<string, string> = {
    'clientName': "client.name",
    'agentName': "agent.name",
  };
  const isJsonbSort = sortColumn in jsonbSortMap;

  // 3. Build modified args — strip search and any handled filters
  const modifiedArgs = {
    ...findArgs,
    search: undefined,
    sort: isJsonbSort
      ? { column: 'humanReadableId', order: findArgs.sort.order }
      : findArgs.sort,
    filters: Object.keys(remainingFilters).length > 0 ? remainingFilters : undefined,
  };

  // 4. Create the base paginated query, passing relation names to left-join
  const sqlQuery = this.customQuery.newPaginatedQuery(
    this.myEntityRepository as IBaseRepository<MyEntity>,
    modifiedArgs,
    undefined,           // searchColumns (pass if using built-in search)
    ['agent', 'client']  // relations to left-join
  );

  // 5. Manual search via Brackets (ILIKE)
  if (findArgs.search) {
    const searchTerm = `%${findArgs.search}%`;
    sqlQuery.andWhere(
      new Brackets((qb) => {
        qb.where('"table"."humanReadableId" ILIKE :searchId', { searchId: searchTerm })
          .orWhere('"table"."name" ILIKE :searchName', { searchName: searchTerm })
          .orWhere('"client"."name" ILIKE :searchClient', { searchClient: searchTerm })
          .orWhere('"agent"."name" ILIKE :searchAgent', { searchAgent: searchTerm });
      })
    );
  }

  // 6. Custom filters on joined tables
  if (agentGuid)  sqlQuery.andWhere('"agent"."guid" = :agentGuid', { agentGuid });
  if (clientGuid) sqlQuery.andWhere('"client"."guid" = :clientGuid', { clientGuid });
  if (dateFrom)   sqlQuery.andWhere('"table"."dueDate" >= :dateFrom', { dateFrom });
  if (dateTo)     sqlQuery.andWhere('"table"."dueDate" <= :dateTo', { dateTo });

  // 7. Override sort for joined columns
  if (isJsonbSort) {
    sqlQuery.orderBy(jsonbSortMap[sortColumn], findArgs.sort.order);
  }

  const result = await sqlQuery.getManyAndCount();
  return this.customQuery.formatPaginatedResult<MyEntity>(result);
}
```

> **Note on alias in WHERE clauses:** `newPaginatedQuery` always aliases the root table as `"table"`. Joined relations use their own name as alias (e.g. `"agent"`, `"client"`).

### findOne

```typescript
async findOne(guid: UUID): Promise<MyEntity> {
  const entity = await this.myEntityRepository.getOne({
    where: { guid },
    relations: {
      client: true,
      agent: true,
      createdBy: true,  // from BaseEntity
      updatedBy: true,  // from BaseEntity
    },
  });

  if (!entity) throw new NotFoundException("Mi entidad no encontrada.");
  return entity;
}
```

### create

```typescript
async create(input: CreateMyEntityInput): Promise<MyEntity> {
  // Validate related records exist
  const client = await this.clientsRepository.getOne({ where: { guid: input.clientGuid as UUID } });
  if (!client) throw new NotFoundException("Cliente no encontrado.");

  // createOne auto-stamps createdById and updatedById via CLS context
  const entity = this.myEntityRepository.createOne({
    name: input.name,
    budget: input.budget,
    clientId: client.id,       // always store numeric FK
    clientAddress: input.clientAddress,
  });

  const saved = await this.myEntityRepository.saveOne(entity);
  return this.findOne(saved.guid);  // re-fetch with all relations
}
```

### update

```typescript
async update(input: UpdateMyEntityInput): Promise<GenericOutput> {
  const entity = await this.myEntityRepository.getOne({ where: { guid: input.guid as UUID } });
  if (!entity) throw new NotFoundException("Mi entidad no encontrada.");

  // Resolve FK changes
  let clientId = entity.clientId;
  if (input.clientGuid) {
    const client = await this.clientsRepository.getOne({ where: { guid: input.clientGuid as UUID } });
    if (!client) throw new NotFoundException("Cliente no encontrado.");
    clientId = client.id;
  }

  // Destructure guid + relation guids out, spread the rest
  const { guid, clientGuid, ...updateData } = input;

  Object.assign(entity, {
    ...updateData,
    clientId,
  });

  await this.myEntityRepository.saveOne(entity);
  return { message: "Mi entidad actualizada exitosamente." };
}
```

### delete (soft)

```typescript
async delete(guid: UUID): Promise<GenericOutput> {
  const entity = await this.myEntityRepository.getOne({ where: { guid } });
  if (!entity) throw new NotFoundException("Mi entidad no encontrada.");

  await this.myEntityRepository.softDeleteWithId(entity.id);
  return { message: "Mi entidad eliminada exitosamente." };
}
```

---

## Step 5 — Resolver

**File:** `modules/{module}/view/{module}.resolver.ts`

```typescript
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UUID } from "crypto";
import { JwtAuthGuard } from "../../auth/domain/guards/jwtAuth.guard";
// For role restriction, also import:
// import { HasRoles } from "../../auth/domain/guards/hasRoles.decorator";
// import { RolesGuard } from "../../auth/domain/guards/roles.guard";
// import { UserRole } from "../../../shared/data/types/users/userRole.model";

@Resolver(() => MyEntity)
export class MyEntitiesResolver {
  constructor(private readonly myEntitiesService: MyEntitiesService) {}

  // ── Authenticated only (no role restriction) ──
  @Query(() => PaginatedMyEntities)
  @UseGuards(JwtAuthGuard)
  async myEntities(@Args("findMyEntitiesArgs") args: FindMyEntitiesArgs) {
    return this.myEntitiesService.findAll(args);
  }

  @Query(() => MyEntity)
  @UseGuards(JwtAuthGuard)
  async myEntity(@Args("guid") guid: UUID) {
    return this.myEntitiesService.findOne(guid);
  }

  @Mutation(() => MyEntity)
  @UseGuards(JwtAuthGuard)
  async createMyEntity(@Args("input") input: CreateMyEntityInput) {
    return this.myEntitiesService.create(input);
  }

  @Mutation(() => GenericOutput)
  @UseGuards(JwtAuthGuard)
  async updateMyEntity(@Args("input") input: UpdateMyEntityInput) {
    return this.myEntitiesService.update(input);
  }

  @Mutation(() => GenericOutput)
  @UseGuards(JwtAuthGuard)
  async deleteMyEntity(@Args("guid") guid: UUID) {
    return this.myEntitiesService.delete(guid);
  }
}
```

**With role restriction:**
```typescript
@HasRoles(UserRole.ADMIN, UserRole.COMMERCIAL)
@UseGuards(JwtAuthGuard, RolesGuard)
```

---

## Step 6 — Module

**File:** `modules/{module}/{module}.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MyEntitiesService } from "./domain/myEntities.service";
import { MyEntitiesResolver } from "./view/myEntities.resolver";
import { MyEntity } from "src/shared/data/entities/{module}/myEntity.entity";
import { Client } from "src/shared/data/entities/clients/client.entity";
import { User } from "src/shared/data/entities/users/user.entity";
import { RepositoryFactory } from "src/shared/data/repositories/baseRepository/baseRepository";

@Module({
  imports: [
    TypeOrmModule.forFeature([MyEntity, Client, User])
  ],
  providers: [
    RepositoryFactory(MyEntity),   // one per entity registered above
    RepositoryFactory(Client),
    RepositoryFactory(User),
    MyEntitiesResolver,
    MyEntitiesService,
  ],
  exports: [MyEntitiesService],    // export only if other modules need it
})
export class MyEntitiesModule {}
```

> `RepositoryFactory` wraps the TypeORM repository with the custom `IBaseRepository` interface and injects CLS context for automatic `createdById`/`updatedById` stamping.

---

## Step 7 — Register in AppModule

**File:** `src/app.module.ts`

```typescript
import { MyEntitiesModule } from "./modules/{module}/myEntities.module";

@Module({
  imports: [
    // ...existing modules...
    MyEntitiesModule,
  ],
})
export class AppModule {}
```

---

## Shared Utilities Quick Reference

| Utility | Path |
|---|---|
| `BaseEntity` | `src/shared/data/entities/baseEntity.ts` |
| `AddressInput` / `AddressOutput` | `src/shared/data/types/users/address.model.ts` |
| `GenericOutput` | `src/shared/presentation/dto/output/generic.output.ts` |
| `PaginatedList<T>` | `src/shared/presentation/dto/output/paginated-list.output.ts` |
| `FindGenericsWithNoPublicFiltersInput` | `src/shared/presentation/dto/input/findGenerics.input.ts` |
| `FindGenericsInput` | `src/shared/presentation/dto/input/findGenerics.input.ts` |
| `IBaseRepository<T>` | `src/shared/data/repositories/baseRepository/baseRepository.ts` |
| `RepositoryFactory` | `src/shared/data/repositories/baseRepository/baseRepository.ts` |
| `RepositoryCustomQueryService` | `src/shared/services/foundation/repositoryCustomQuery.service.ts` |
| `JwtAuthGuard` | `src/modules/auth/domain/guards/jwtAuth.guard.ts` |
| `RolesGuard` | `src/modules/auth/domain/guards/roles.guard.ts` |
| `HasRoles` | `src/modules/auth/domain/guards/hasRoles.decorator.ts` |
| `UserRole` | `src/shared/data/types/users/userRole.model.ts` |
| `SortType` | `src/shared/presentation/dto/input/findGenerics.input.ts` |

---

## `IBaseRepository` Method Cheatsheet

| Method | Description |
|---|---|
| `createOne(data)` | Instantiates entity, stamps `createdById`/`updatedById` from CLS |
| `saveOne(entity)` | Saves (insert or update), stamps `updatedById` |
| `saveMany(entities)` | Bulk save |
| `getOne(options)` | `findOne` with optional relations (handles soft-delete exclusion automatically) |
| `getOneOrFail(options)` | Same as `getOne` but throws `NotFoundException` if not found |
| `getOneBy(where)` | Simple `findOneBy` |
| `findMany(options)` | `find` with optional relations |
| `updateBy(where, partial)` | `UPDATE … SET` via criteria, stamps `updatedById` |
| `softDeleteWithId(id)` | Sets `deletedDate` (soft delete) — always use numeric `id`, not `guid` |
| `createQuery(alias)` | Returns a raw `SelectQueryBuilder` for custom queries |
