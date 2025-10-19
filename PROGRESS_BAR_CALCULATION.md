# Progress Bar Calculation - Team Documentation

## 📊 Progress Bar Calculation Logic

### 1. **Data Sources for Match Percentage**

The progress bar uses match percentage from multiple possible sources in this priority order:

```javascript
const matchPercentage = match.compatibility_score || 
                       match.match_percentage || 
                       match.match_percent || 
                       0;
```

### 2. **Backend API Response Structure**

The match percentage comes from backend API in these fields:
- `compatibility_score` - Primary field from new API
- `match_percentage` - Alternative field name
- `match_percent` - Another alternative field name
- Default: `0` if none found

### 3. **Progress Bar Width Calculation**

```javascript
<div
  className="progress-bar"
  style={{
    width: `${match?.match_percentage || 0}%`,
    backgroundColor: getProgressBarColor(match?.match_percentage),
  }}
></div>
```

**Formula:** `width = match_percentage + "%"`

### 4. **Progress Bar Color Logic**

```javascript
const getProgressBarColor = (matchPercentage) => {
  const percentage = parseFloat(matchPercentage) || 0;
  
  if (percentage >= 75) return "#10b981"; // Green - Excellent Match
  if (percentage >= 60) return "#3b82f6"; // Blue - Good Match  
  if (percentage >= 45) return "#f59e0b"; // Orange - Moderate Match
  if (percentage >= 30) return "#f97316"; // Dark Orange - Low-Moderate Match
  return "#ef4444"; // Red - Very Low Match
};
```

### 5. **Color Coding System**

| Percentage Range | Color | Match Quality | Description |
|------------------|-------|---------------|-------------|
| 75% - 100% | 🟢 Green (#10b981) | Excellent | High compatibility |
| 60% - 74% | 🔵 Blue (#3b82f6) | Good | Good compatibility |
| 45% - 59% | 🟠 Orange (#f59e0b) | Moderate | Moderate compatibility |
| 30% - 44% | 🟠 Dark Orange (#f97316) | Low-Moderate | Low-moderate compatibility |
| 0% - 29% | 🔴 Red (#ef4444) | Very Low | Very low compatibility |

### 6. **Average Compatibility Calculation**

```javascript
const avgCompatibility = filteredItems.length > 0 
  ? Math.round(filteredItems.reduce((sum, match) => sum + (match.match_percentage || 0), 0) / filteredItems.length)
  : 0;
```

**Formula:** `Average = Sum of all match_percentages / Total number of matches`

### 7. **Modal Score Display**

In the modal, the score is displayed as:
```javascript
<span className="score-number">{matchData.overallScore}%</span>
```

Where `overallScore` is calculated as:
```javascript
const getBackendMatchData = (member) => {
  return {
    overallScore: member.match_percentage || member.compatibility_score || 0,
    matchBreakdown: member.match_breakdown || member.compatibility_details || null,
  };
};
```

### 8. **Data Processing Flow**

1. **API Call** → Backend returns match data
2. **Data Extraction** → Extract percentage from multiple possible fields
3. **Processing** → Clean and validate percentage values
4. **Display** → Render progress bar with calculated width and color
5. **Update** → Real-time updates when filters change

### 9. **Key Points for Team**

- **No Frontend Calculation**: All percentages come from backend API
- **Multiple Field Support**: Handles different API response structures
- **Fallback Values**: Always has a default value (0) if data missing
- **Real-time Updates**: Progress bars update when filters change
- **Responsive Design**: Works on all screen sizes
- **Color Accessibility**: Uses distinct colors for different match levels

### 10. **Troubleshooting**

If progress bars show 0%:
1. Check API response has `compatibility_score` or `match_percentage`
2. Verify data structure matches expected format
3. Check console for any data processing errors
4. Ensure backend is returning valid percentage values (0-100)

### 11. **API Endpoints Used**

#### **Primary API Endpoints:**

1. **Member Info API:**
   ```javascript
   URL: /api/agent/user/matches/
   Method: GET
   Purpose: Get member information and basic match data
   ```

2. **Detailed Matches API:**
   ```javascript
   URL: /api/agent/user/detailed-matches/
   Method: GET
   Purpose: Get detailed match breakdown and compatibility scores
   ```

#### **API Function Used:**
```javascript
import { fetchDataWithTokenV2 } from "../../../apiUtils";

// Function signature
fetchDataWithTokenV2({
  url: "/api/agent/user/detailed-matches/",
  setterFunction: (data) => { /* process data */ },
  setLoading: setLoading
});
```

#### **API Response Structure:**
```javascript
{
  compatibility_score: 85,        // Primary match percentage
  match_percentage: 85,           // Alternative field name
  match_percent: 85,              // Another alternative
  match_breakdown: {              // Detailed field analysis
    field_matches: {
      age: { user1_preferences: "25-30", user2_value: "28", matched: true },
      profession: { user1_preferences: "Engineer", user2_value: "Software Engineer", matched: true }
    }
  },
  compatibility_details: {        // Additional compatibility data
    religious_preferences: { matched: true },
    family_values: { matched: false }
  }
}
```

#### **API Configuration:**
- **Base URL**: `process.env.REACT_APP_API_URL`
- **Authentication**: Bearer token from localStorage
- **Headers**: `Authorization: Bearer ${token}`

### 12. **Future Enhancements**

- Add animation for progress bar loading
- Include tooltips with exact percentage values
- Add more granular color coding (10% increments)
- Implement progress bar smoothing effects
