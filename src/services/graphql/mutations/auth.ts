export const REQUEST_OTP_MUTATION = `
  mutation RequestOtp($input: RequestOtpInput!) {
    requestOtp(input: $input)
  }
`;

export const VERIFY_OTP_MUTATION = `
  mutation VerifyOtp($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      user {
        id
        username
        phone
        fullName
        avatarUrl
      }
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_TOKENS_MUTATION = `
  mutation RefreshTokens {
    refreshTokens {
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`;
