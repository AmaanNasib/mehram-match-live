# Shared Styles Usage Guide

## 📦 Overview
`shared-styles.css` contains common styling components used across the entire MehramMatch application for consistency.

---

## 🎨 Marital Status Badges

### Usage
Import the shared styles in your component:
```jsx
import "../../shared-styles.css";
```

Use the `mm-marital-badge` class with appropriate status modifiers:
```jsx
<span className={`mm-marital-badge ${maritalStatus.toLowerCase().replace(" ", "-")}`}>
  {maritalStatus}
</span>
```

### Available Statuses

| Status | Class | Color | Description |
|--------|-------|-------|-------------|
| Never Married | `.mm-marital-badge.never-married` | 🟢 Green | Available for marriage |
| Unmarried | `.mm-marital-badge.unmarried` | 🟢 Green | Single/Available |
| Single | `.mm-marital-badge.single` | 🟢 Green | Not married |
| Married | `.mm-marital-badge.married` | 🔴 Red | Currently married |
| Not Mentioned | `.mm-marital-badge.not-mentioned` | 🔴 Red | Status not provided |
| Divorced | `.mm-marital-badge.divorced` | 🟣 Pink | Separated/Divorced |
| Khula | `.mm-marital-badge.khula` | 🟣 Pink | Islamic divorce |
| Widowed | `.mm-marital-badge.widowed` | 🟡 Yellow | Spouse deceased |

### Example
```jsx
const MemberTable = () => {
  return (
    <td>
      <span className={`mm-marital-badge ${member.martial_status?.toLowerCase()?.replace(" ", "-") || "not-mentioned"}`}>
        {member.martial_status || "Not mentioned"}
      </span>
    </td>
  );
};
```

---

## 🚫 Block Type Badges

### Usage
For agent-related block indicators:
```jsx
<span className={`mm-block-type-badge ${blockType}`}>
  {blockType}
</span>
```

### Available Types
- `.mm-block-type-badge.direct` - 🔴 Red (Agent direct block)
- `.mm-block-type-badge.member` - 🔵 Blue (Member block)

---

## 🟢 Status Badges (Online/Offline)

### Usage
```jsx
<span className="mm-status-badge online">Online</span>
<span className="mm-status-badge offline">Offline</span>
```

### Features
- Animated pulse effect for online status
- Auto dot indicator before text

---

## 🔧 Migration Guide

### Before (Component-specific styles):
```jsx
// Old way - different in each component
import "./ComponentName.css";

<span className="marital-badge married">Married</span>
```

### After (Shared styles):
```jsx
// New way - consistent across all components
import "../../shared-styles.css";

<span className="mm-marital-badge married">Married</span>
```

---

## 📝 Components Already Using Shared Styles

✅ **TotalBlockedAgent** - Fully migrated
- Marital badges: `mm-marital-badge`
- Import: `../../../shared-styles.css`

### Components to Migrate
⏳ **Pending Migration:**
- MemberMatches
- MemberAnalytics
- TotalInterest
- TotalInteraction
- TotalShortlist
- AllUsers
- MyMembers
- And other table components...

---

## 🎯 Benefits

1. **Consistency** - Same look and feel across all tables
2. **Easy Updates** - Change once, apply everywhere
3. **Reduced Code** - No duplicate CSS
4. **Maintainability** - Single source of truth
5. **Responsive** - Built-in mobile responsiveness

---

## 🚀 Best Practices

1. **Always use** `mm-marital-badge` instead of creating custom marital badge styles
2. **Import shared styles** at component level, not globally
3. **Follow naming convention**: `mm-` prefix for MehramMatch shared styles
4. **Test responsiveness** on mobile after implementation
5. **Remove old CSS** from component-specific files after migration

---

## 📱 Responsive Breakpoints

- **Tablet** (max-width: 768px) - Slightly smaller badges
- **Mobile** (max-width: 480px) - Compact badges

---

## 🆘 Need Help?

If you encounter any styling issues:
1. Check if `shared-styles.css` is imported
2. Verify class name spelling (use `mm-` prefix)
3. Check browser console for CSS conflicts
4. Ensure marital status string is lowercase with hyphens

---

## 📌 Notes

- **Prefix**: All shared badge classes use `mm-` (MehramMatch) prefix
- **File Location**: `src/shared-styles.css`
- **Maintenance**: Update only in shared file, never override in components
- **New Statuses**: Add to `shared-styles.css` for project-wide availability

