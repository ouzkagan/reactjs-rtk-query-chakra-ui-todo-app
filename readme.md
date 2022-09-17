# React To-do App with Mockapi.com
An app made with react and redux to manage your todo tasks bootstrapped with [vite](https://vitejs.dev/).

Deployed at: [https://regal-croissant-a1fa52.netlify.app/](https://regal-croissant-a1fa52.netlify.app/)

# Used Technologies
- react, typescript
- react router
- redux-toolkit and redux-toolkit query
- redux-persist
- Chakra-ui, react-icons
- framer-motion
- react-hook-form, Yup validation
- jest

# Background Features
- Protected routes with **react-router**
- Optimistic-pessimistic updates, no unnecessary network requests and fetching todos with with **rtk-query**
- Persisting user **image(base64) and username** information in localStorage with **redux-toolkit** and **redux-persist** + _logout_ 
- Custom **Toast Middleware** for redux to manage notification toasts from 1 place
- Dark mode and skeleton loader with **Chakra-ui**
- pagination with custom usePagination Hook
- **Framer-motion** for UI animations and toast notifications
- **React Hook Form** for forms, **YUP** for validations

# Functionalities
- User need login with nickname and image to use the app. image stored as base64.
- All API calls made with RTK-Query. 
- User can add, edit, delete todos.
- Toast notifications for user on request success and fail 
- User can switch between light and dark mode.
- User inputs protected with Yup validation 

# App screenshots

![Working app gif](https://github.com/ouzkagan/reactjs-rtk-query-chakra-ui-todo-app/blob/master/app-working.gif)