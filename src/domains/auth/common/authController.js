import { registerUser, loginUser } from './authService.js';

/**
 * 사용자 회원가입
 */
export const register = async (req, res) => {
  const { id, password } = req.body; // 요청 본문에서 아이디와 비밀번호 추출

  try {
    const user = await registerUser(req.app.locals.userModel, id, password); // 회원가입 처리
    res.status(201).json({ message: 'User registered', user }); // 성공 응답
  } catch (err) {
    res.status(500).json({ error: err.message }); // 에러 응답
  }
};

/**
 * 사용자 로그인
 */
export const login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const { accessToken, refreshToken } = await loginUser(req.app.locals.userModel, id, password); // 로그인 처리
    res.status(200).json({ accessToken, refreshToken }); // 토큰 반환
  } catch (err) {
    res.status(401).json({ error: err.message }); // 인증 실패 응답
  }
};
