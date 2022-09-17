import '@testing-library/jest-dom';
import { setupStore } from './app/store';
import { apiSlice } from './features/api/apiSlice';
import { server } from './mock/api/server';

const store = setupStore({
    user: {
        user:{
            username:"Kagan",
            image: "mock_image"
        },
        _persist: {
            version:-1,
            rehydrated:true
        }
    }
});


// Establish API mocking before all tests.
beforeAll(() => {
    server.listen();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
    server.resetHandlers();
    // This is the solution to clear RTK Query cache after each test
    store.dispatch(apiSlice.util.resetApiState());
});

// Clean up after the tests are finished.
afterAll(() => server.close());