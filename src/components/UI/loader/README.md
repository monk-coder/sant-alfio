# Loader Component

A simple, customizable loading spinner component for React applications.

## Usage

```tsx
import Loader from '@components/UI/loader';

// Basic usage
<Loader />

// With custom size
<Loader size="small" />
<Loader size="medium" /> // default
<Loader size="large" />

// With custom color
<Loader color="#ff0000" />

// With custom class name
<Loader className="my-custom-class" />

// Full example with overlay container
{isLoading && (
  <div className="loader-container">
    <Loader size="large" />
  </div>
)}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'small' \| 'medium' \| 'large' | 'medium' | Size of the loader |
| color | string | '#007bff' | Color of the loader spinner |
| className | string | '' | Additional CSS class name |

## CSS Example for Overlay Container

```css
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1000;
}
```