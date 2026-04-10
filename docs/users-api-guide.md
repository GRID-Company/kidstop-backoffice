# Users API Guide

## Overview

The Users API manages user accounts, profiles, roles, activation status, and client status. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All user endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Roles & Permissions

| Role | Description |
|------|-------------|
| `SUPERUSER` | Full system access, bypasses all role checks |
| `ADMIN` | User management, configuration, full CRUD |
| `RECEPTION` | Front-desk operations |
| `BUYER` | Purchase operations |
| `CLIENT` | Registered customer |
| `CLIENT_KIOSK` | In-store kiosk customer |

## Available Endpoints

### 1. Get Users (Paginated)

**Query:** `users`
**Description:** Retrieve paginated list of users with basic information
**Roles:** `ADMIN`

```graphql
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      active
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "active": true
    }
  }
}
```

**Response Fields:**

- `guid`: Unique user identifier
- `emailAddress`: User email
- `name`: Full name
- `phone`: Phone number
- `role`: User role (SUPERUSER, ADMIN, RECEPTION, BUYER, CLIENT, CLIENT_KIOSK)
- `clientStatus`: Client status (STANDARD, VIP, BLOCKED) — only applicable to CLIENT role
- `active`: Whether the user account is active
- `signedUp`: Whether the user has completed the signup process
- `count`: Total number of matching records

---

### 2. Get Users with Multiple Role Filter

**Query:** `users`
**Description:** Filter users by multiple roles simultaneously
**Roles:** `ADMIN`

```graphql
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      active
      signedUp
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "role": {
        "filterType": ":multiple_values:",
        "values": ["ADMIN", "MANAGER", "EMPLOYEE"]
      },
      "active": true
    }
  }
}
```

**Available Role Values:** `SUPERUSER`, `ADMIN`, `RECEPTION`, `BUYER`, `CLIENT`, `CLIENT_KIOSK`

---

### 3. Get Users with Search

**Query:** `users`
**Description:** Search users by name or email with optional role filters
**Roles:** `ADMIN`

```graphql
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      active
      signedUp
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "name",
      "order": "ASC"
    },
    "search": "john",
    "filters": {
      "role": {
        "filterType": ":multiple_values:",
        "values": ["ADMIN", "EMPLOYEE"]
      },
      "active": true
    }
  }
}
```

**Search Field:** Matches against user `name` and `emailAddress`

---

### 4. Get Users by Client Status

**Query:** `users`
**Description:** Filter CLIENT users by their client status (STANDARD, VIP, BLOCKED)
**Roles:** `ADMIN`

```graphql
query Users($findUsersArgs: FindUsersArgs!) {
  users(findUsersArgs: $findUsersArgs) {
    data {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      active
      signedUp
    }
    count
  }
}
```

**Variables:**

```json
{
  "findUsersArgs": {
    "skip": 0,
    "limit": 10,
    "sort": {
      "column": "createdDate",
      "order": "DESC"
    },
    "filters": {
      "role": {
        "filterType": ":multiple_values:",
        "values": ["CLIENT"]
      },
      "clientStatus": "BLOCKED",
      "active": true
    }
  }
}
```

**Available Client Status Values:** `STANDARD`, `VIP`, `BLOCKED`

---

### 5. Get Single User

**Query:** `user`
**Description:** Get detailed information for a specific user by GUID
**Roles:** `ADMIN`

```graphql
query User($guid: String!) {
  user(guid: $guid) {
    guid
    emailAddress
    name
    phone
    role
    clientStatus
    active
    signedUp
    createdDate
    updatedDate
  }
}
```

**Variables:**

```json
{
  "guid": "user-guid-here"
}
```

**Additional Response Fields:**

- `createdDate`: Account creation timestamp
- `updatedDate`: Last update timestamp

---

### 6. Get User Profile (Self-Service)

**Query:** `userProfile`
**Description:** Get the authenticated user's own profile. Available to all authenticated users (no role restriction).
**Roles:** Any authenticated user

```graphql
query UserProfile {
  userProfile {
    guid
    emailAddress
    name
    phone
    role
    clientStatus
    active
    signedUp
  }
}
```

**Variables:** None required — uses the token to identify the user

---

### 7. Create Super User

**Mutation:** `createSuperUser`
**Description:** One-time mutation to create the first superuser. No authentication required (bootstrapping endpoint).
**Roles:** No auth required (one-time use)

```graphql
mutation CreateSuperUser($createUserInput: CreateUserInput!) {
  createSuperUser(createUserInput: $createUserInput) {
    guid
    emailAddress
    name
    phone
    role
    active
    signedUp
  }
}
```

**Variables:**

```json
{
  "createUserInput": {
    "emailAddress": "contacto@topdev.mx",
    "name": "Superusuario",
    "password": "your-secure-password",
    "role": "SUPERUSER"
  }
}
```

**Input Fields:**

- `emailAddress`: User email (must be unique)
- `name`: Full name
- `password`: Account password
- `role`: Must be `SUPERUSER`

---

### 8. Create User

**Mutation:** `createUser`
**Description:** Create a new user account
**Roles:** `ADMIN`

```graphql
mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    guid
    emailAddress
    name
    phone
    role
    active
    signedUp
  }
}
```

**Variables:**

```json
{
  "createUserInput": {
    "emailAddress": "newuser@example.com",
    "name": "New User",
    "role": "ADMIN",
    "phone": "1234567890"
  }
}
```

**Input Fields:**

- `emailAddress`: User email (must be unique)
- `name`: Full name
- `role`: One of ADMIN, RECEPTION, BUYER, CLIENT, CLIENT_KIOSK
- `phone`: Phone number (optional)

---

### 9. Update User

**Mutation:** `updateUser`
**Description:** Update an existing user's information (admin manages other users)
**Roles:** `ADMIN`

```graphql
mutation UpdateUser($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    message
  }
}
```

**Variables:**

```json
{
  "updateUserInput": {
    "guid": "user-guid-here",
    "name": "Updated Name",
    "emailAddress": "updated@example.com",
    "phone": "9876543210",
    "role": "ADMIN"
  }
}
```

**Input Fields:**

- `guid`: (required) Target user GUID
- `name`: Updated name
- `emailAddress`: Updated email
- `phone`: Updated phone
- `role`: Updated role

---

### 10. Update User Profile (Self-Service)

**Mutation:** `updateUserProfile`
**Description:** Allows any authenticated user to update their own profile information
**Roles:** Any authenticated user

```graphql
mutation UpdateUserProfile($updateUserProfileInput: UpdateUserProfileInput!) {
  updateUserProfile(updateUserProfileInput: $updateUserProfileInput) {
    message
  }
}
```

**Variables:**

```json
{
  "updateUserProfileInput": {
    "name": "Updated Name",
    "emailAddress": "myemail@example.com",
    "phone": "9876543210"
  }
}
```

**Input Fields:**

- `name`: Updated name
- `emailAddress`: Updated email
- `phone`: Updated phone

> Note: Users cannot change their own role via this endpoint.

---

### 11. Delete User

**Mutation:** `deleteUser`
**Description:** Soft-delete a user account. Deleted users cannot log in.
**Roles:** `ADMIN`

```graphql
mutation DeleteUser($guid: String!) {
  deleteUser(guid: $guid) {
    message
  }
}
```

**Variables:**

```json
{
  "guid": "user-guid-here"
}
```

---

### 12. Set Client Status

**Mutation:** `setClientStatus`
**Description:** Set the client status for a CLIENT user (STANDARD, VIP, or BLOCKED)
**Roles:** `ADMIN`

```graphql
mutation SetClientStatus($setClientStatusInput: SetClientStatusInput!) {
  setClientStatus(setClientStatusInput: $setClientStatusInput) {
    message
  }
}
```

**Variables:**

```json
{
  "setClientStatusInput": {
    "guid": "REPLACE_WITH_USER_GUID",
    "clientStatus": "VIP"
  }
}
```

**Input Fields:**

- `guid`: (required) Target user GUID
- `clientStatus`: One of `STANDARD`, `VIP`, `BLOCKED`

**Business Rules:**

- Only applicable to users with `CLIENT` role
- `BLOCKED` clients cannot place new sales orders
- Clients can be auto-blocked by the system when they exceed the `saleCancellationBlockThreshold` configured in Global Config

---

## Available Filters Summary

| Filter | Type | Description |
|--------|------|-------------|
| `active` | `Boolean` | Filter by account active status |
| `role` | `MultipleValues` | Filter by one or more roles using `filterType: ":multiple_values:"` |
| `clientStatus` | `String` | Filter by client status (STANDARD, VIP, BLOCKED) |
| `search` | `String` | Free-text search on name and email |

## Frontend Integration Examples

### React/TypeScript Implementation

```typescript
// Types
interface User {
  guid: string;
  emailAddress: string;
  name: string;
  phone?: string;
  role: 'SUPERUSER' | 'ADMIN' | 'RECEPTION' | 'BUYER' | 'CLIENT' | 'CLIENT_KIOSK';
  clientStatus?: 'STANDARD' | 'VIP' | 'BLOCKED';
  active: boolean;
  signedUp: boolean;
  createdDate?: string;
  updatedDate?: string;
}

interface PaginatedUsers {
  data: User[];
  count: number;
}

// GraphQL Queries
const GET_USERS = gql`
  query Users($findUsersArgs: FindUsersArgs!) {
    users(findUsersArgs: $findUsersArgs) {
      data {
        guid
        emailAddress
        name
        phone
        role
        clientStatus
        active
        signedUp
      }
      count
    }
  }
`;

const GET_USER_PROFILE = gql`
  query UserProfile {
    userProfile {
      guid
      emailAddress
      name
      phone
      role
      clientStatus
      active
      signedUp
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      guid
      emailAddress
      name
      phone
      role
      active
      signedUp
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      message
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($guid: String!) {
    deleteUser(guid: $guid) {
      message
    }
  }
`;

const SET_CLIENT_STATUS = gql`
  mutation SetClientStatus($setClientStatusInput: SetClientStatusInput!) {
    setClientStatus(setClientStatusInput: $setClientStatusInput) {
      message
    }
  }
`;

// Authenticated Apollo Client Setup
const createAuthenticatedClient = (token: string) => {
  return new ApolloClient({
    uri: 'YOUR_GRAPHQL_ENDPOINT',
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// User Management Component
const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [authToken] = useAuth();

  const client = createAuthenticatedClient(authToken);

  const fetchUsers = async (filters?: any) => {
    try {
      const { data } = await client.query({
        query: GET_USERS,
        variables: {
          findUsersArgs: {
            skip: 0,
            limit: 50,
            sort: { column: "createdDate", order: "DESC" },
            ...(filters && { filters })
          }
        }
      });
      setUsers(data.users.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ active: true });
  }, []);

  return (
    <div className="user-manager">
      <h2>User Management</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <UserTable users={users} onRefresh={fetchUsers} />
      )}
    </div>
  );
};
```

### User CRUD Functions

```typescript
// Create User
const createUser = async (
  emailAddress: string,
  name: string,
  role: string,
  phone?: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        createUserInput: { emailAddress, name, role, phone }
      }
    });
    console.log('User created:', data.createUser);
    await fetchUsers();
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Update User
const updateUser = async (
  guid: string,
  updates: Partial<{ name: string; emailAddress: string; phone: string; role: string }>
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_USER,
      variables: {
        updateUserInput: { guid, ...updates }
      }
    });
    console.log('User updated:', data.updateUser.message);
    await fetchUsers();
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// Delete User
const deleteUser = async (guid: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_USER,
      variables: { guid }
    });
    console.log('User deleted:', data.deleteUser.message);
    await fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

// Set Client Status
const setClientStatus = async (guid: string, clientStatus: 'STANDARD' | 'VIP' | 'BLOCKED') => {
  try {
    const { data } = await client.mutate({
      mutation: SET_CLIENT_STATUS,
      variables: {
        setClientStatusInput: { guid, clientStatus }
      }
    });
    console.log('Client status updated:', data.setClientStatus.message);
    await fetchUsers();
  } catch (error) {
    console.error('Error setting client status:', error);
  }
};
```

## Error Handling & Best Practices

### Authentication Error Handling

```typescript
const handleAuthError = (error: any) => {
  if (error.networkError?.statusCode === 401) {
    // Token expired or invalid
    logout();
    redirectToLogin();
  }
};
```

### Role-Based UI Rendering

```typescript
const RoleBasedActions: React.FC<{ currentUserRole: string }> = ({ currentUserRole }) => {
  const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'SUPERUSER';

  return (
    <div>
      {isAdmin && (
        <>
          <button onClick={() => openCreateUserModal()}>Create User</button>
          <button onClick={() => openManageUsersPanel()}>Manage Users</button>
        </>
      )}
      <button onClick={() => openProfileEditor()}>Edit My Profile</button>
    </div>
  );
};
```

## Key Features for Frontend Implementation

1. **User List with Filters:** Implement filterable user table with role, status, and search filters
2. **Role-Based Access Control:** Show/hide UI elements based on the authenticated user's role
3. **Self-Service Profile:** Allow users to edit their own profile without admin access
4. **Client Management:** Manage client statuses (VIP, BLOCKED) with confirmation dialogs
5. **User Deletion:** Soft-delete users with confirmation dialogs
6. **Search:** Full-text search across user names and emails
7. **Pagination:** Server-side pagination with skip/limit for large user lists
8. **Audit Trail:** Display createdDate and updatedDate for user records
