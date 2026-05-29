import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaLock,
  FaMobileAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import {
  accountEmailPattern,
  accountMobilePattern,
  clearAccountSession,
  createAccountSalt,
  dispatchAccountSessionChange,
  getAccountUserName,
  hashAccountPassword,
  normalizeAccountEmail,
  normalizeAccountMobile,
  readAccountUsers,
  readCurrentAccountUser,
  saveAccountUsers,
  writeAccountSession,
} from "../utils/account";

const initialLoginForm = {
  identifier: "",
  password: "",
  remember: false,
};

const initialRegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  marketing: false,
};

const inputClass =
  "mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]";

const labelClass =
  "text-xs font-black uppercase tracking-[0.22em] text-gray-400";

const getProfileForm = (user) => ({
  fullName: getAccountUserName(user),
  email: user?.email || "",
  mobile: user?.mobile || "",
});

function Field({ id, label, icon: Icon, error, ...inputProps }) {
  return (
    <label htmlFor={id} className="block">
      <span className={labelClass}>{label}</span>
      <span className="relative mt-2 block">
        <Icon
          className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c69a4b]"
          aria-hidden="true"
        />
        <input
          id={id}
          className={`${inputClass} mt-0 pl-12`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
      </span>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-red-300">
          {error}
        </p>
      )}
    </label>
  );
}

function StatusBanner({ message }) {
  if (!message) return null;

  return (
    <div
      className="mt-6 flex items-start gap-3 rounded-3xl border border-[#c69a4b]/35 bg-[#17120a] p-4 text-sm font-semibold leading-relaxed text-gray-200 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
      role="status"
    >
      <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c69a4b]" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

function DashboardCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[28px] border border-[#2f2f2f] bg-black p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/40 bg-[#17120a] text-[#c69a4b]">
        <Icon aria-hidden="true" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-500">
        {label}
      </p>
      <p className="mt-3 break-words text-lg font-black text-white">{value}</p>
    </div>
  );
}

function AccountLinkCard({ icon: Icon, title, to }) {
  return (
    <Link
      to={to}
      className="rounded-[28px] border border-[#2f2f2f] bg-black p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#c69a4b]/60"
    >
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-full border border-[#c69a4b]/40 bg-[#17120a] text-[#c69a4b]">
        <Icon aria-hidden="true" />
      </div>
      <p className="text-lg font-black text-white">{title}</p>
      <p className="mt-2 text-sm font-semibold text-[#c69a4b]">Open</p>
    </Link>
  );
}

function AccountPanel({ children, eyebrow, title }) {
  return (
    <section className="rounded-[30px] border border-[#c69a4b]/35 bg-[#0d0d0d] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c69a4b]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black">{title}</h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default function MyAccount() {
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [currentUser, setCurrentUser] = useState(readCurrentAccountUser);
  const [profileForm, setProfileForm] = useState(() => getProfileForm(currentUser));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "My Account | Athleev Nutrition";
  }, []);

  const clearFeedback = () => {
    setErrors({});
    setStatus("");
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const identifier = loginForm.identifier.trim();
    const nextErrors = {};
    if (!identifier) nextErrors.identifier = "Enter your email address or mobile number.";
    if (!loginForm.password.trim()) nextErrors.password = "Enter your password.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const normalizedIdentifier = identifier.includes("@")
        ? normalizeAccountEmail(identifier)
        : normalizeAccountMobile(identifier);
      const user = readAccountUsers().find(
        (item) =>
          item.email === normalizedIdentifier || item.mobile === normalizedIdentifier,
      );

      if (!user) {
        setErrors({ identifier: "No account found with this email or mobile number." });
        setIsSubmitting(false);
        return;
      }

      const passwordHash = await hashAccountPassword(loginForm.password, user.passwordSalt);
      if (passwordHash !== user.passwordHash) {
        setErrors({ password: "Password is incorrect." });
        setIsSubmitting(false);
        return;
      }

      writeAccountSession(user, { remember: loginForm.remember });
      dispatchAccountSessionChange();
      setCurrentUser(user);
      setProfileForm(getProfileForm(user));
      setLoginForm(initialLoginForm);
      setStatus("You are logged in successfully.");
    } catch (error) {
      setStatus(error.message || "Unable to login right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const firstName = registerForm.firstName.trim();
    const lastName = registerForm.lastName.trim();
    const email = normalizeAccountEmail(registerForm.email);
    const mobile = normalizeAccountMobile(registerForm.mobile);
    const nextErrors = {};

    if (!firstName) nextErrors.firstName = "Enter your first name.";
    if (!lastName) nextErrors.lastName = "Enter your last name.";
    if (!email) {
      nextErrors.email = "Enter your email address.";
    } else if (!accountEmailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!mobile) {
      nextErrors.mobile = "Enter your phone number.";
    } else if (!accountMobilePattern.test(mobile)) {
      nextErrors.mobile = "Enter a valid 10 digit phone number.";
    }
    if (!registerForm.password.trim()) {
      nextErrors.registerPassword = "Create a password.";
    } else if (registerForm.password.length < 6) {
      nextErrors.registerPassword = "Password must be at least 6 characters.";
    }
    if (!registerForm.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    const users = readAccountUsers();
    if (users.some((user) => user.email === email)) {
      nextErrors.email = "An account with this email already exists.";
    }
    if (users.some((user) => user.mobile === mobile)) {
      nextErrors.mobile = "An account with this phone number already exists.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const passwordSalt = createAccountSalt();
      const passwordHash = await hashAccountPassword(registerForm.password, passwordSalt);
      const user = {
        id: `athleev-${Date.now()}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        mobile,
        marketing: registerForm.marketing,
        passwordSalt,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      saveAccountUsers([...users, user]);
      writeAccountSession(user);
      dispatchAccountSessionChange();
      setCurrentUser(user);
      setProfileForm(getProfileForm(user));
      setRegisterForm(initialRegisterForm);
      setStatus("Account created successfully. You are now logged in.");
    } catch (error) {
      setStatus(error.message || "Unable to create account right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearAccountSession();
    dispatchAccountSessionChange();
    setCurrentUser(null);
    setProfileForm(getProfileForm(null));
    setLoginForm(initialLoginForm);
    clearFeedback();
  };

  const handleProfileSave = (event) => {
    event.preventDefault();
    if (!currentUser) return;

    const fullName = profileForm.fullName.trim();
    const email = normalizeAccountEmail(profileForm.email);
    const mobile = normalizeAccountMobile(profileForm.mobile);
    const nextErrors = {};

    if (!fullName) nextErrors.profileFullName = "Enter your full name.";
    if (!email) {
      nextErrors.profileEmail = "Enter your email address.";
    } else if (!accountEmailPattern.test(email)) {
      nextErrors.profileEmail = "Enter a valid email address.";
    }
    if (!mobile) {
      nextErrors.profileMobile = "Enter your mobile number.";
    } else if (!accountMobilePattern.test(mobile)) {
      nextErrors.profileMobile = "Enter a valid 10 digit mobile number.";
    }

    const users = readAccountUsers();
    if (users.some((user) => user.email === email && user.id !== currentUser.id)) {
      nextErrors.profileEmail = "This email is already used by another account.";
    }
    if (users.some((user) => user.mobile === mobile && user.id !== currentUser.id)) {
      nextErrors.profileMobile = "This mobile number is already used by another account.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const updatedUser = {
      ...currentUser,
      fullName,
      firstName: fullName.split(" ")[0] || fullName,
      lastName: fullName.split(" ").slice(1).join(" "),
      email,
      mobile,
    };

    saveAccountUsers(users.map((user) => (user.id === currentUser.id ? updatedUser : user)));
    writeAccountSession(updatedUser);
    setCurrentUser(updatedUser);
    setProfileForm(getProfileForm(updatedUser));
    dispatchAccountSessionChange();
    setStatus("Profile saved successfully.");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-5 py-12 text-white sm:px-6 md:px-12 lg:px-20 lg:py-16">
      <section className="ath-section-container">
        <div className="mb-10 border-b border-[#c69a4b]/20 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#c69a4b]">
            Athleev Account
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            My <span className="text-[#c69a4b]">Account</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
            Login or create your Athleev account with a clean ecommerce account
            experience.
          </p>
        </div>

        {currentUser ? (
          <div className="ath-premium-card border-[#c69a4b]/45 p-6 shadow-[#c69a4b]/10 sm:p-8">
            <div className="rounded-[30px] border border-[#c69a4b]/35 bg-gradient-to-br from-[#17120a] to-black p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c69a4b]">
                Account Overview
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Welcome, {getAccountUserName(currentUser)}
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <DashboardCard icon={FaUser} label="User Name" value={getAccountUserName(currentUser)} />
              <DashboardCard icon={FaEnvelope} label="Email" value={currentUser.email} />
              <DashboardCard icon={FaMobileAlt} label="Mobile Number" value={currentUser.mobile} />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AccountLinkCard icon={FaUser} title="My Profile" to="/my-account" />
              <AccountLinkCard icon={FaCheckCircle} title="My Orders" to="/my-orders" />
              <AccountLinkCard icon={FaMobileAlt} title="My Address" to="/my-address" />
              <AccountLinkCard icon={FaEnvelope} title="Refer & Earn" to="/refer-earn" />
            </div>

            <form className="mt-8 rounded-[30px] border border-[#c69a4b]/30 bg-black p-6 sm:p-8" onSubmit={handleProfileSave}>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c69a4b]">
                My Profile
              </p>
              <h3 className="mt-3 text-3xl font-black">Profile Details</h3>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <label htmlFor="profile-name" className="block">
                  <span className={labelClass}>Full Name</span>
                  <input
                    id="profile-name"
                    type="text"
                    value={profileForm.fullName}
                    onChange={(event) => {
                      setProfileForm((form) => ({ ...form, fullName: event.target.value }));
                      setErrors({});
                      setStatus("");
                    }}
                    className={inputClass}
                  />
                  {errors.profileFullName && (
                    <p className="mt-2 text-sm font-semibold text-red-300">{errors.profileFullName}</p>
                  )}
                </label>
                <label htmlFor="profile-email" className="block">
                  <span className={labelClass}>Email</span>
                  <input
                    id="profile-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(event) => {
                      setProfileForm((form) => ({ ...form, email: event.target.value }));
                      setErrors({});
                      setStatus("");
                    }}
                    className={inputClass}
                  />
                  {errors.profileEmail && (
                    <p className="mt-2 text-sm font-semibold text-red-300">{errors.profileEmail}</p>
                  )}
                </label>
                <label htmlFor="profile-mobile" className="block">
                  <span className={labelClass}>Mobile Number</span>
                  <input
                    id="profile-mobile"
                    type="tel"
                    value={profileForm.mobile}
                    onChange={(event) => {
                      setProfileForm((form) => ({
                        ...form,
                        mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                      }));
                      setErrors({});
                      setStatus("");
                    }}
                    className={inputClass}
                  />
                  {errors.profileMobile && (
                    <p className="mt-2 text-sm font-semibold text-red-300">{errors.profileMobile}</p>
                  )}
                </label>
              </div>
              <button type="submit" className="ath-btn-primary mt-6 px-6 py-4">
                Save Changes
              </button>
            </form>

            <button
              type="button"
              onClick={handleLogout}
              className="ath-btn-outline mt-8 w-full gap-3 px-6 py-4"
            >
              <FaSignOutAlt aria-hidden="true" />
              Logout
            </button>
            <StatusBanner message={status} />
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <AccountPanel eyebrow="Returning Customer" title="Login">
              <form className="grid gap-5" onSubmit={handleLoginSubmit}>
                <Field
                  id="login-identifier"
                  label="Email Address or Mobile Number"
                  icon={FaEnvelope}
                  type="text"
                  value={loginForm.identifier}
                  onChange={(event) =>
                    setLoginForm((form) => ({
                      ...form,
                      identifier: event.target.value,
                    }))
                  }
                  placeholder="you@example.com or 9876543210"
                  autoComplete="username"
                  error={errors.identifier}
                />
                <Field
                  id="login-password"
                  label="Password"
                  icon={FaLock}
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((form) => ({
                      ...form,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  error={errors.password}
                />
                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="checkbox"
                      checked={loginForm.remember}
                      onChange={(event) =>
                        setLoginForm((form) => ({
                          ...form,
                          remember: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[#c69a4b]"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setStatus("Please contact Athleev support for password assistance.")
                    }
                    className="font-semibold text-[#c69a4b] transition hover:text-[#d4b16f]"
                  >
                    Lost your password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ath-btn-primary w-full px-6 py-4 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                  {isSubmitting ? "Logging In..." : "Log In"}
                </button>
              </form>
            </AccountPanel>

            <AccountPanel eyebrow="New Customer" title="Create an account">
              <form className="grid gap-5" onSubmit={handleRegisterSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    id="register-first-name"
                    label="First Name"
                    icon={FaUser}
                    type="text"
                    value={registerForm.firstName}
                    onChange={(event) =>
                      setRegisterForm((form) => ({
                        ...form,
                        firstName: event.target.value,
                      }))
                    }
                    placeholder="First name"
                    autoComplete="given-name"
                    error={errors.firstName}
                  />
                  <Field
                    id="register-last-name"
                    label="Last Name"
                    icon={FaUser}
                    type="text"
                    value={registerForm.lastName}
                    onChange={(event) =>
                      setRegisterForm((form) => ({
                        ...form,
                        lastName: event.target.value,
                      }))
                    }
                    placeholder="Last name"
                    autoComplete="family-name"
                    error={errors.lastName}
                  />
                </div>
                <Field
                  id="register-email"
                  label="Email Address"
                  icon={FaEnvelope}
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email}
                />
                <Field
                  id="register-mobile"
                  label="Phone"
                  icon={FaMobileAlt}
                  type="tel"
                  value={registerForm.mobile}
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      mobile: event.target.value,
                    }))
                  }
                  placeholder="9876543210"
                  autoComplete="tel"
                  inputMode="numeric"
                  error={errors.mobile}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    id="register-password"
                    label="Password"
                    icon={FaLock}
                    type="password"
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((form) => ({
                        ...form,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Create password"
                    autoComplete="new-password"
                    error={errors.registerPassword}
                  />
                  <Field
                    id="register-confirm-password"
                    label="Confirm Password"
                    icon={FaLock}
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      setRegisterForm((form) => ({
                        ...form,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                  />
                </div>
                <label className="flex items-start gap-3 rounded-2xl border border-[#2f2f2f] bg-black p-4 text-sm leading-6 text-gray-300">
                  <input
                    type="checkbox"
                    checked={registerForm.marketing}
                    onChange={(event) =>
                      setRegisterForm((form) => ({
                        ...form,
                        marketing: event.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-[#c69a4b]"
                  />
                  I agree to receive Athleev marketing communications.
                </label>
                <p className="text-sm leading-6 text-gray-400">
                  By registering, you confirm that you accept Athleev terms and
                  privacy practices for account use.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ath-btn-primary w-full px-6 py-4 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                  {isSubmitting ? "Creating Account..." : "Register"}
                </button>
              </form>
            </AccountPanel>
            <div className="lg:col-span-2">
              <StatusBanner message={status} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
