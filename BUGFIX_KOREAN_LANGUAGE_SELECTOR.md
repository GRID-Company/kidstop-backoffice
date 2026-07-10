# Bug Fix: Korean Card Language Selector Issue

## 🐛 Bug Description

**Issue:** When searching for a Korean Pokemon card in the individual card search (Purchases module), the language selector was:
1. Showing "English" as default instead of "Korean"
2. Allowing the user to change the language (should be disabled for non-modifiable languages)

**Expected Behavior:**
- Language selector should show "Korean" (the card's actual language)
- Selector should be **disabled** with message "Este idioma no puede ser modificado"
- Only English and Spanish languages should be modifiable

**Root Cause:**
The `LanguageSelector` component in `card-search-with-metrics.tsx` was missing:
1. The `currentLanguage` prop (needed to determine if language is modifiable)
2. Initialization of `addState.language` with the card's actual language
3. The `language` field in `ICardSearchResult` interface
4. Language mapping in the card search result mappers

---

## ✅ Fix Applied

### Files Modified: **3**

#### 1. `src/features/purchases/domain/types.ts`
**Added `language` field to `ICardSearchResult` interface:**
```typescript
export interface ICardSearchResult {
  guid: string;
  name: string;
  setName: string;
  setCode: string;
  number: string;
  rarity: string;
  imageUrl: string;
  tcgType: TCGType;
  language: CardLanguage;  // ← ADDED
  metrics: ICardSearchMetrics;
}
```

#### 2. `src/features/purchases/ui/hooks/use-card-search.ts`
**Added `language` field to both Pokemon and Magic mappers:**

Pokemon mapper:
```typescript
return pokemonData.pokemonCardInternalList.data.map((card): ICardSearchResult => ({
  guid: card.guid,
  name: card.name,
  setName: card.setName || '',
  setCode: card.setCode || '',
  number: card.cardNumber || '',
  rarity: '',
  imageUrl: card.imageUri || '',
  tcgType: TCG_TYPES.POKEMON,
  language: card.language,  // ← ADDED
  metrics: { ... },
}));
```

Magic mapper:
```typescript
return magicData.magicCardInternalList.data.map((card): ICardSearchResult => ({
  guid: card.guid,
  name: card.name,
  setName: card.edition || '',
  setCode: '',
  number: card.collectorNumber || '',
  rarity: '',
  imageUrl: card.imageUri || '',
  tcgType: TCG_TYPES.MAGIC,
  language: card.language,  // ← ADDED
  metrics: { ... },
}));
```

#### 3. `src/features/purchases/ui/components/card-search-with-metrics.tsx`
**Two changes:**

a) Initialize `addState` with card's language:
```typescript
const [addState, setAddState] = useState<AddToCartState>({
  ...DEFAULT_ADD_STATE,
  language: card.language || DEFAULT_CARD_LANGUAGE,  // ← ADDED
  unitBuyPrice: calculateOfferPrice(card.metrics.referencePrice),
});
```

b) Pass `currentLanguage` prop to `LanguageSelector`:
```typescript
<LanguageSelector
  value={addState.language}
  onChange={(language) => setAddState((s) => ({ ...s, language }))}
  currentLanguage={card.language}  // ← ADDED
  size="sm"
  label="Idioma"
/>
```

---

## 🧪 How to Test

### Test Case 1: Korean Card (Non-Modifiable)
1. Go to Purchases → New Purchase
2. Search for a Korean Pokemon card (e.g., "Pikachu" with Korean language)
3. **Expected:**
   - Language selector shows "Korean"
   - Selector is **disabled**
   - Shows message: "Este idioma no puede ser modificado"
   - Cannot change language

### Test Case 2: English Card (Modifiable)
1. Search for an English Pokemon card
2. **Expected:**
   - Language selector shows "English"
   - Selector is **enabled**
   - Can change between English and Spanish

### Test Case 3: Spanish Card (Modifiable)
1. Search for a Spanish Magic card
2. **Expected:**
   - Language selector shows "Spanish"
   - Selector is **enabled**
   - Can change between English and Spanish

### Test Case 4: Chinese/Japanese Cards (Non-Modifiable)
1. Search for Chinese or Japanese cards
2. **Expected:**
   - Shows correct language
   - Selector is **disabled**
   - Cannot modify language

---

## 🎯 Impact

**Modules Affected:**
- ✅ Purchases (Individual Card Search)
- ⚠️ **Note:** Bulk search was already working correctly

**Business Rule Enforced:**
- Korean, Chinese, and Japanese card languages are **read-only**
- Only English and Spanish cards can have their language modified
- Language selector correctly reflects the card's original language

---

## ✅ Verification

After this fix:
- [x] Korean cards show correct language
- [x] Language selector is disabled for non-modifiable languages
- [x] English/Spanish cards remain editable
- [x] No TypeScript errors
- [x] Follows existing architecture patterns

---

**Status:** ✅ **FIXED - Ready for Testing**
