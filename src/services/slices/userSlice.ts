import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export type UserState = {
  isAuthChecked: boolean;
  data: TUser | null;
  error: string | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    try {
      if (localStorage.getItem('refreshToken')) {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      }
    } catch (e) {
      console.error('Auth check error:', e);
    } finally {
      dispatch(authChecked());
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(userLogout());
  }
);

export const initialState: UserState = {
  isAuthChecked: false,
  data: null,
  error: null,
  loginUserError: null,
  loginUserRequest: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.data = action.payload;
    },
    userLogout: (state) => {
      state.data = null;
    }
  },
  selectors: {
    getUser: (state) => state.data,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getError: (state) => state.loginUserError
  },
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Ошибка логина';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      });
  }
});

export const { authChecked, userLogout, setUser } = userSlice.actions;
export const { getUser, getIsAuthChecked, getError } = userSlice.selectors;

export default userSlice.reducer;
