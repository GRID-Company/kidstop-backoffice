# Global Config API Guide

## Overview

The Global Config API manages platform-wide configuration settings such as inventory limits, purchase percentages, and sale cancellation thresholds. All endpoints require authentication and use GraphQL.

**Base URL:** `{{base_url}}`
**Protocol:** GraphQL (POST requests)
**Authentication:** Required for all endpoints

## Authentication

All global config endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{auth_token}}
```

## Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `inventoryLimit` | `Number` | Maximum inventory stock limit per item |
| `purchasePercentage` | `Float` | Default purchase price percentage (0–1 range, e.g. 0.5 = 50%) |
| `saleCancellationBlockThreshold` | `Number` | Number of cancellations before a client is automatically blocked |
| `geofence` | `Object` | Geofence location configuration with latitude, longitude, and radius |
| `geofence.latitude` | `Float` | Geofence center latitude coordinate |
| `geofence.longitude` | `Float` | Geofence center longitude coordinate |
| `geofence.radius` | `Float` | Geofence radius in meters |
| `operationSchedule` | `Object` | Weekly operation schedule with opening/closing times for each day |
| `operationSchedule.{day}` | `Object` | Schedule for a specific day (monday, tuesday, etc.) |
| `operationSchedule.{day}.opening` | `Object` | Opening time with hour (1-12), minute (0-59), and period (AM/PM) |
| `operationSchedule.{day}.closing` | `Object` | Closing time with hour (1-12), minute (0-59), and period (AM/PM) |

## Available Endpoints

### 1. Get Global Config

**Query:** `globalConfig`
**Description:** Retrieve the current global configuration. If no config exists yet, one is automatically created with default (empty) values.
**Roles:** Any authenticated user

```graphql
query GlobalConfig {
  globalConfig {
    guid
    config {
      inventoryLimit
      purchasePercentage
      saleCancellationBlockThreshold
      geofence {
        latitude
        longitude
        radius
      }
      operationSchedule {
        monday {
          opening { hour minute period }
          closing { hour minute period }
        }
        tuesday {
          opening { hour minute period }
          closing { hour minute period }
        }
        wednesday {
          opening { hour minute period }
          closing { hour minute period }
        }
        thursday {
          opening { hour minute period }
          closing { hour minute period }
        }
        friday {
          opening { hour minute period }
          closing { hour minute period }
        }
        saturday {
          opening { hour minute period }
          closing { hour minute period }
        }
        sunday {
          opening { hour minute period }
          closing { hour minute period }
        }
      }
    }
    createdDate
    updatedDate
  }
}
```

**Variables:** None required

**Response Fields:**

- `guid`: Unique config record identifier
- `config.inventoryLimit`: Maximum inventory stock limit
- `config.purchasePercentage`: Default purchase price percentage
- `config.saleCancellationBlockThreshold`: Cancellation count before auto-blocking a client
- `config.geofence`: Geofence location configuration (latitude, longitude, radius in meters)
- `config.operationSchedule`: Weekly schedule with opening/closing times for each day in 12-hour format
- `createdDate`: Record creation timestamp
- `updatedDate`: Last update timestamp

---

### 2. Update Global Config

**Mutation:** `updateGlobalConfig`
**Description:** Update one or more global configuration values. Only the fields you provide will be updated; omitted fields remain unchanged.
**Roles:** `ADMIN`

```graphql
mutation UpdateGlobalConfig($updateGlobalConfigInput: UpdateGlobalConfigInput!) {
  updateGlobalConfig(updateGlobalConfigInput: $updateGlobalConfigInput) {
    message
  }
}
```

**Variables:**

```json
{
  "updateGlobalConfigInput": {
    "inventoryLimit": 100,
    "purchasePercentage": 0.5,
    "saleCancellationBlockThreshold": 3,
    "geofence": {
      "latitude": 25.6866,
      "longitude": -100.3161,
      "radius": 1000
    },
    "operationSchedule": {
      "monday": {
        "opening": { "hour": 9, "minute": 0, "period": "AM" },
        "closing": { "hour": 6, "minute": 0, "period": "PM" }
      },
      "tuesday": {
        "opening": { "hour": 9, "minute": 0, "period": "AM" },
        "closing": { "hour": 6, "minute": 0, "period": "PM" }
      },
      "wednesday": {
        "opening": { "hour": 9, "minute": 0, "period": "AM" },
        "closing": { "hour": 6, "minute": 0, "period": "PM" }
      },
      "thursday": {
        "opening": { "hour": 9, "minute": 0, "period": "AM" },
        "closing": { "hour": 6, "minute": 0, "period": "PM" }
      },
      "friday": {
        "opening": { "hour": 9, "minute": 0, "period": "AM" },
        "closing": { "hour": 6, "minute": 0, "period": "PM" }
      },
      "saturday": {
        "opening": { "hour": 10, "minute": 0, "period": "AM" },
        "closing": { "hour": 4, "minute": 0, "period": "PM" }
      },
      "sunday": {
        "opening": { "hour": 10, "minute": 0, "period": "AM" },
        "closing": { "hour": 2, "minute": 0, "period": "PM" }
      }
    }
  }
}
```

**Input Fields:**

- `inventoryLimit`: (optional) New inventory limit value
- `purchasePercentage`: (optional) New purchase percentage (0–1 range)
- `saleCancellationBlockThreshold`: (optional) New cancellation threshold before auto-block
- `geofence`: (optional) Geofence configuration object
  - `latitude`: Geofence center latitude
  - `longitude`: Geofence center longitude
  - `radius`: Geofence radius in meters
- `operationSchedule`: (optional) Weekly operation schedule
  - Each day (`monday`, `tuesday`, etc.) contains:
    - `opening`: Opening time object with `hour` (1-12), `minute` (0-59), `period` (AM/PM)
    - `closing`: Closing time object with `hour` (1-12), `minute` (0-59), `period` (AM/PM)

**Business Rules:**

- All fields are optional — only provided fields are updated
- The config is a singleton record (one per platform)
- If no config exists when updating, one is created first
- `purchasePercentage` is used by the Purchases module to calculate default purchase prices
- `saleCancellationBlockThreshold` is used by the Sales module to auto-block clients who exceed the cancellation limit
- `geofence` defines a circular location boundary for location-based features (e.g., kiosk mode activation)
- `operationSchedule` uses 12-hour time format with separate hour (1-12), minute (0-59), and period (AM/PM) fields
- Days in `operationSchedule` can be omitted or null to indicate closed days

---

## Frontend Integration Examples

### React/TypeScript Implementation

```typescript
// Types
enum TimePeriod {
  AM = 'AM',
  PM = 'PM'
}

interface Time {
  hour: number;
  minute: number;
  period: TimePeriod;
}

interface DaySchedule {
  opening: Time;
  closing: Time;
}

interface OperationSchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

interface Geofence {
  latitude: number;
  longitude: number;
  radius: number;
}

interface GlobalConfigData {
  inventoryLimit: number;
  purchasePercentage: number;
  saleCancellationBlockThreshold: number;
  geofence?: Geofence;
  operationSchedule?: OperationSchedule;
}

interface GlobalConfig {
  guid: string;
  config: GlobalConfigData;
  createdDate: string;
  updatedDate: string;
}

// GraphQL Queries
const GET_GLOBAL_CONFIG = gql`
  query GlobalConfig {
    globalConfig {
      guid
      config {
        inventoryLimit
        purchasePercentage
        saleCancellationBlockThreshold
        geofence {
          latitude
          longitude
          radius
        }
        operationSchedule {
          monday { opening { hour minute period } closing { hour minute period } }
          tuesday { opening { hour minute period } closing { hour minute period } }
          wednesday { opening { hour minute period } closing { hour minute period } }
          thursday { opening { hour minute period } closing { hour minute period } }
          friday { opening { hour minute period } closing { hour minute period } }
          saturday { opening { hour minute period } closing { hour minute period } }
          sunday { opening { hour minute period } closing { hour minute period } }
        }
      }
      createdDate
      updatedDate
    }
  }
`;

const UPDATE_GLOBAL_CONFIG = gql`
  mutation UpdateGlobalConfig($updateGlobalConfigInput: UpdateGlobalConfigInput!) {
    updateGlobalConfig(updateGlobalConfigInput: $updateGlobalConfigInput) {
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

// Global Config Component
const GlobalConfigManager: React.FC = () => {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken] = useAuth();

  const client = createAuthenticatedClient(authToken);

  const fetchConfig = async () => {
    try {
      const { data } = await client.query({
        query: GET_GLOBAL_CONFIG
      });
      setConfig(data.globalConfig);
    } catch (error) {
      console.error('Error fetching global config:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="config-manager">
      <h2>Platform Configuration</h2>
      {loading ? (
        <div>Loading configuration...</div>
      ) : config ? (
        <ConfigForm config={config} onSave={fetchConfig} />
      ) : (
        <div>No configuration found</div>
      )}
    </div>
  );
};
```

### Config Update Functions

```typescript
// Update Global Config
const updateGlobalConfig = async (
  updates: Partial<GlobalConfigData>
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_GLOBAL_CONFIG,
      variables: {
        updateGlobalConfigInput: updates
      }
    });
    console.log('Config updated:', data.updateGlobalConfig.message);
    await fetchConfig();
  } catch (error) {
    console.error('Error updating config:', error);
  }
};

// Update individual fields
const updateInventoryLimit = (limit: number) =>
  updateGlobalConfig({ inventoryLimit: limit });

const updatePurchasePercentage = (percentage: number) =>
  updateGlobalConfig({ purchasePercentage: percentage });

const updateCancellationThreshold = (threshold: number) =>
  updateGlobalConfig({ saleCancellationBlockThreshold: threshold });
```

### Config Settings Form

```typescript
const ConfigForm: React.FC<{ config: GlobalConfig; onSave: () => void }> = ({ config, onSave }) => {
  const [formData, setFormData] = useState({
    inventoryLimit: config.config.inventoryLimit || 0,
    purchasePercentage: config.config.purchasePercentage || 0,
    saleCancellationBlockThreshold: config.config.saleCancellationBlockThreshold || 0,
    geofence: config.config.geofence || { latitude: 0, longitude: 0, radius: 0 },
    operationSchedule: config.config.operationSchedule || {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGlobalConfig(formData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="config-form">
      <h3>Platform Settings</h3>
      <div>
        <label>Inventory Limit</label>
        <input
          type="number"
          value={formData.inventoryLimit}
          onChange={(e) => setFormData({...formData, inventoryLimit: parseInt(e.target.value)})}
          min="0"
        />
      </div>
      <div>
        <label>Purchase Percentage</label>
        <input
          type="number"
          step="0.01"
          value={formData.purchasePercentage}
          onChange={(e) => setFormData({...formData, purchasePercentage: parseFloat(e.target.value)})}
          min="0"
          max="1"
        />
      </div>
      <div>
        <label>Cancellation Block Threshold</label>
        <input
          type="number"
          value={formData.saleCancellationBlockThreshold}
          onChange={(e) => setFormData({...formData, saleCancellationBlockThreshold: parseInt(e.target.value)})}
          min="0"
        />
      </div>
      
      <h4>Geofence Configuration</h4>
      <div>
        <label>Latitude</label>
        <input
          type="number"
          step="0.0001"
          value={formData.geofence.latitude}
          onChange={(e) => setFormData({...formData, geofence: {...formData.geofence, latitude: parseFloat(e.target.value)}})}
        />
      </div>
      <div>
        <label>Longitude</label>
        <input
          type="number"
          step="0.0001"
          value={formData.geofence.longitude}
          onChange={(e) => setFormData({...formData, geofence: {...formData.geofence, longitude: parseFloat(e.target.value)}})}
        />
      </div>
      <div>
        <label>Radius (meters)</label>
        <input
          type="number"
          value={formData.geofence.radius}
          onChange={(e) => setFormData({...formData, geofence: {...formData.geofence, radius: parseFloat(e.target.value)}})}
          min="0"
        />
      </div>
      
      <h4>Operation Schedule</h4>
      <p><em>Configure opening/closing times for each day (12-hour format)</em></p>
      {/* Add time picker components for each day of the week */}
      
      <button type="submit">Save Configuration</button>
    </form>
  );
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

### Permission Check

```typescript
const canEditConfig = (userRole: string): boolean => {
  return userRole === 'ADMIN' || userRole === 'SUPERUSER';
};
```

## Key Features for Frontend Implementation

1. **Read-Only for Non-Admins:** All authenticated users can view the config, but only ADMIN/SUPERUSER can edit
2. **Partial Updates:** Only send the fields you want to change — no need to send the full config
3. **Validation:** Ensure `purchasePercentage` stays within 0–1 range and thresholds are positive integers
4. **Confirmation Dialog:** Prompt confirmation before saving config changes since they affect platform-wide behavior
5. **Audit Display:** Show `createdDate` and `updatedDate` so admins know when config was last modified
6. **Cross-Module Impact:** Clearly label which settings affect which modules (Purchases, Sales, Inventory)
