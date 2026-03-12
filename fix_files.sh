#!/bin/bash

# Fix OptimizedComponentsDemo.tsx
sed -i 's|    |    </div>|g' src/react-app/pages/OptimizedComponentsDemo.tsx
sed -i '534c\  )' src/react-app/pages/OptimizedComponentsDemo.tsx

# Fix WebVitalsDemo.tsx  
sed -i 's|    |    </div>|g' src/react-app/pages/WebVitalsDemo.tsx
sed -i '448c\  );' src/react-app/pages/WebVitalsDemo.tsx
