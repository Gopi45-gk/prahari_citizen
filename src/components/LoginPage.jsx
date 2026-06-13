import React, { useState } from 'react';
import { setItem } from '../utils/storage';
import { demoUser } from '../data/demoData';
import backgroundImage from '../assets/prahari-clean-train-bg.jpg';
import { useTranslation } from '../i18n/useTranslation';

export default function LoginPage({ onLogin }) {
  const { t } = useTranslation();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loginMethod, setLoginMethod] = useState('mobile'); // 'mobile' or 'email'

  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("Passenger");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleGuestLogin = () => {
    setItem('prahari_user', demoUser);
    onLogin(demoUser);
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      name: "Google User",
      email: "user@gmail.com",
      loginMethod: "google"
    };

    onLogin(googleUser);
    
    // Simulating toast notification
    console.log(t("googleLoginSuccess"));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (authMode === "login") {
      if (loginMethod === "mobile") {
        if (!mobileNumber.trim() || !password.trim()) {
          showToast(t("fillRequiredFields") || "Please fill all required fields");
          return;
        }
      }

      if (loginMethod === "email") {
        if (!email.trim() || !password.trim()) {
          showToast(t("fillRequiredFields") || "Please fill all required fields");
          return;
        }

        if (!isValidEmail(email)) {
          showToast(t("invalidEmail") || "Please enter a valid email address");
          return;
        }
        
        const users = JSON.parse(localStorage.getItem("prahari_users")) || [];
        const matchedUser = users.find(
          (user) => user.email === email && user.password === password
        );

        if (!matchedUser) {
          showToast(t("invalidLoginCredentials") || "Invalid login credentials");
          return;
        }

        onLogin(matchedUser);
        return;
      }
    }

    if (authMode === "register") {
      if (!name.trim() || !password.trim() || !confirmPassword.trim() || !selectedRole) {
        showToast(t("fillRequiredFields") || "Please fill all required fields");
        return;
      }

      if (password !== confirmPassword) {
        showToast(t("passwordsDoNotMatch") || "Passwords do not match");
        return;
      }

      if (!mobileNumber.trim() && !email.trim()) {
        showToast(t("fillRequiredFields") || "Please fill all required fields");
        return;
      }

      if (email.trim() && !isValidEmail(email)) {
        showToast(t("invalidEmail") || "Please enter a valid email address");
        return;
      }

      if (password.length < 6) {
        showToast(t("weakPassword") || "Password must be at least 6 characters");
        return;
      }

      const users = JSON.parse(localStorage.getItem("prahari_users")) || [];
      const userExists = users.some((user) => user.email === email);

      if (userExists) {
        showToast(t("emailAlreadyUsed") || "Email already used");
        return;
      }

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email || mobileNumber || "",
        password: password,
        role: selectedRole,
        safetyPoints: 420,
        verifiedReports: 8,
        communityRank: 14,
        loginMethod: "registered"
      };

      users.push(newUser);
      localStorage.setItem("prahari_users", JSON.stringify(users));

      onLogin(newUser);
    }
  };

  const logoUrl = "https://www.image2url.com/r2/default/images/1781337580193-02063940-ebdc-4685-9858-cd2bc0eb30ca.png";

  return (
    <div
      className="min-h-screen w-full bg-cover bg-no-repeat relative flex items-center justify-center px-4 py-4 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.00), rgba(255,255,255,0.03)), url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat"
      }}
    >
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold animate-fade-in whitespace-nowrap">
          {toastMessage}
        </div>
      )}
      <div className="w-full max-w-[420px] rounded-[1.75rem] bg-white/62 backdrop-blur-[5px] border border-white/50 shadow-2xl px-6 py-5 md:px-7 md:py-6">
        
        <div className="text-center mb-4 md:mb-5">
          <img
            src={logoUrl}
            alt="PRAHARI Citizen"
            className="w-12 h-12 object-contain mx-auto mb-2"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            {t("appName")}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {t("loginSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 mb-4">
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`h-10 md:h-11 rounded-xl font-semibold transition-all ${
              authMode === "login"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("login")}
          </button>

          <button
            type="button"
            onClick={() => setAuthMode("register")}
            className={`h-10 md:h-11 rounded-xl font-semibold transition-all ${
              authMode === "register"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("register")}
          </button>
        </div>

        <div className="grid grid-cols-2 mb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setLoginMethod("mobile")}
            className={`pb-2.5 text-sm font-semibold transition-all ${
              loginMethod === "mobile"
                ? "text-blue-700 border-b-2 border-blue-600"
                : "text-slate-500"
            }`}
          >
            {t("mobileLogin")}
          </button>

          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className={`pb-2.5 text-sm font-semibold transition-all ${
              loginMethod === "email"
                ? "text-blue-700 border-b-2 border-blue-600"
                : "text-slate-500"
            }`}
          >
            {t("emailLogin")}
          </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3 md:gap-4 mb-4" noValidate>
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('name')}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-12 md:h-14 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          )}

          {loginMethod === 'mobile' ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('mobileNumber')}</label>
              <input type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="w-full h-12 md:h-14 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+91" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('emailAddress')}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 md:h-14 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="name@example.com" />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 md:h-14 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('confirmPassword') || 'Confirm Password'}</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full h-12 md:h-14 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('selectRole')}</label>
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-full h-12 md:h-14 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="passenger">{t('passenger')}</option>
                <option value="staff">{t('railwayStaff')}</option>
                <option value="resident">{t('tracksideResident')}</option>
                <option value="volunteer">{t('volunteer')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 md:h-14 mt-1 md:mt-2 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all"
          >
            {authMode === 'login' ? t('login') : t('register')}
          </button>
        </form>

        <div className="flex items-center gap-4 my-4 md:my-5">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-sm font-medium text-slate-400">{t("or")}</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-12 md:h-14 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-semibold text-slate-700 mb-3 md:mb-4 px-4"
        >
          <svg
            className="h-5 w-5 md:h-6 md:w-6 shrink-0"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>

          <span className="whitespace-normal text-center">
            {t("continueWithGoogle")}
          </span>
        </button>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="mt-3 md:mt-4 w-full min-h-12 md:min-h-14 rounded-2xl bg-white border border-blue-100 text-blue-700 font-bold shadow-sm hover:shadow-md hover:bg-blue-50 transition-all px-4 py-2.5 md:py-3 whitespace-normal text-center"
        >
          {t("continueAsGuest")}
        </button>

      </div>
    </div>
  );
}
