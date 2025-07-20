# Color Replacement Implementation Guide

## Quick Reference: Red to Semantic Color Mapping

### Form Validation & Errors
```tsx
// ❌ Old - Harsh and stressful
className="border-red-500 text-red-500"

// ✅ New - Softer but still clear
className="border-error text-error"
```

### Status Indicators
```tsx
// ❌ Old - All negative states use red
'overdue': 'bg-red-100 text-red-800'
'urgent': 'text-red-600'
'locked': 'text-red-500'

// ✅ New - Appropriate semantic colors
'overdue': 'bg-critical/10 text-critical'
'urgent': 'text-warning'
'locked': 'text-muted-foreground'
```

### Progress & Achievement
```tsx
// ❌ Old - Discouraging red for low progress
if (progress < 30) return "bg-red-500"

// ✅ New - Encouraging orange suggests improvement opportunity
if (progress < 30) return "bg-warning"
```

### Destructive Actions
```tsx
// ❌ Old - Generic red for all destructive actions
<Button className="text-red-600">Delete</Button>

// ✅ New - Graduated severity
<Button className="text-error">Remove Item</Button>      // Reversible
<Button className="text-critical">Delete Account</Button> // Permanent
```

## Component-Specific Updates

### 1. Form Components

#### Input Validation
```tsx
// Error state
<Input className={errors.field ? "border-error" : ""} />
{errors.field && <p className="text-error text-sm">{errors.field.message}</p>}

// Success state
<Input className="border-success" />
<p className="text-success text-sm">✓ Valid email address</p>
```

#### Password Strength Indicator
```tsx
const getStrengthColor = (score: number) => {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-info'  
  if (score >= 40) return 'text-warning'
  if (score >= 20) return 'text-error'
  return 'text-critical'
}
```

### 2. Status & Progress Components

#### Assignment Status
```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-success/10 text-success'
    case 'in-progress': return 'bg-info/10 text-info'
    case 'pending': return 'bg-warning/10 text-warning'
    case 'overdue': return 'bg-critical/10 text-critical'
    case 'failed': return 'bg-error/10 text-error'
    default: return 'bg-muted/10 text-muted-foreground'
  }
}
```

#### Progress Bars
```tsx
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-success'
  if (percentage >= 60) return 'bg-info'
  if (percentage >= 40) return 'bg-warning'
  if (percentage >= 20) return 'bg-error'
  return 'bg-critical'
}
```

### 3. Notification Components

#### Toast Notifications
```tsx
const getNotificationStyles = (type: string) => {
  switch (type) {
    case 'success': return 'notification-success'
    case 'info': return 'notification-info'
    case 'warning': return 'notification-warning'
    case 'error': return 'notification-error'
    case 'critical': return 'notification-critical'
    default: return 'notification-info'
  }
}
```

#### Alert Icons
```tsx
const getAlertIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle className="h-5 w-5 text-success" />
    case 'info': return <Info className="h-5 w-5 text-info" />
    case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />
    case 'error': return <AlertCircle className="h-5 w-5 text-error" />
    case 'critical': return <XCircle className="h-5 w-5 text-critical" />
    default: return <Bell className="h-5 w-5 text-muted-foreground" />
  }
}
```

### 4. Button Hierarchy

#### Primary Actions
```tsx
// Main brand actions - warm and inviting
<Button className="bg-eduflow-primary hover:bg-eduflow-dark text-white">
  Start Learning
</Button>
```

#### Destructive Actions
```tsx
// Reversible destructive actions
<Button variant="outline" className="border-error text-error hover:bg-error/10">
  Remove from List
</Button>

// Permanent destructive actions
<Button className="bg-critical hover:bg-critical/90 text-critical-foreground">
  Delete Account
</Button>
```

## CSS Utility Classes

### Background Variants
```css
.bg-error-subtle { background: hsl(var(--error) / 0.1); }
.bg-warning-subtle { background: hsl(var(--warning) / 0.1); }
.bg-critical-subtle { background: hsl(var(--critical) / 0.1); }
.bg-success-subtle { background: hsl(var(--success) / 0.1); }
.bg-info-subtle { background: hsl(var(--info) / 0.1); }
```

### Border Variants
```css
.border-error-subtle { border-color: hsl(var(--error) / 0.3); }
.border-warning-subtle { border-color: hsl(var(--warning) / 0.3); }
.border-critical-subtle { border-color: hsl(var(--critical) / 0.3); }
```

### Text Variants
```css
.text-error-muted { color: hsl(var(--error) / 0.7); }
.text-warning-muted { color: hsl(var(--warning) / 0.7); }
.text-critical-muted { color: hsl(var(--critical) / 0.7); }
```

## Dark Mode Considerations

### Automatic Adjustments
The semantic color system automatically adjusts for dark mode:

```css
/* Light mode */
--error: 4 90% 58%;     /* Coral */

/* Dark mode */  
--error: 4 90% 65%;     /* Slightly brighter for visibility */
```

### Component Implementation
```tsx
// No changes needed - colors automatically adapt
<div className="bg-error/10 text-error border border-error/20">
  Error message
</div>
```

## Migration Checklist

### Phase 1: Critical Components ✅
- [x] Form validation messages
- [x] Login/register error states
- [x] Assignment status indicators
- [x] Primary brand elements

### Phase 2: Status & Progress
- [ ] Quiz timer warnings
- [ ] Progress indicators
- [ ] Achievement badges
- [ ] Notification priorities

### Phase 3: Interactive Elements
- [ ] Button hierarchy
- [ ] Link states
- [ ] Hover effects
- [ ] Focus indicators

### Phase 4: Data Visualization
- [ ] Chart colors
- [ ] Graph indicators
- [ ] Dashboard metrics
- [ ] Analytics displays

## Testing Guidelines

### Visual Testing
1. Check all states in light/dark modes
2. Verify contrast ratios meet WCAG standards
3. Test with colorblind simulation tools
4. Validate semantic meaning consistency

### User Testing
1. Form completion rates
2. Error recovery patterns  
3. Stress level indicators
4. Task completion confidence

### Accessibility Testing
1. Screen reader compatibility
2. Keyboard navigation clarity
3. High contrast mode support
4. Color-independent information conveyance

## Common Pitfalls to Avoid

### ❌ Don't Mix Old and New Systems
```tsx
// Bad - inconsistent color language
<div className="text-red-500">Error</div>
<div className="text-error">Another error</div>
```

### ❌ Don't Override Semantic Meaning
```tsx
// Bad - success color for error state
<div className="text-success">Form validation failed</div>
```

### ❌ Don't Ignore Context
```tsx
// Bad - critical color for minor issue
<div className="text-critical">Optional field missing</div>

// Good - appropriate severity
<div className="text-warning">Optional field missing</div>
```

### ✅ Do Use Consistent Hierarchy
```tsx
// Good - clear severity progression
<div className="text-info">Info message</div>
<div className="text-warning">Warning message</div>
<div className="text-error">Error message</div>
<div className="text-critical">Critical message</div>
```

## Performance Notes

### CSS Variable Benefits
- Smaller bundle size (one color definition)
- Runtime theme switching capability
- Consistent color management
- Easy maintenance and updates

### Browser Support
- CSS Custom Properties: 95%+ browser support
- HSL color space: Universal support
- Graceful degradation for older browsers
