import React, { useState, useRef } from "react";
import "./Auth.css";
import req from "../../Axios/Axios"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../LoaderContext";
import { setUser } from "../../session";
import usePageMeta from "../../usePageMeta";


function App() {
  const nav = useNavigate();
  usePageMeta({ title: 'Two Tone · Sign in or join', description: 'Sign in to Two Tone or create an account to save favourites, build 12-packs and order small-batch sodas and iced teas.', path: '/' });
  const { setLoading } = useLoader()
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('')
  const [userMail, setUserMail] = useState('');
  const [userId, setUserId] = useState('')
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newstringOtp, setNewOtp] = useState('');


  // Refs for OTP inputs to manage focus
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Switching between sign in and create account pours a wave of drink over the page:
  // it rises, the page changes underneath while it is covered, then it drains off the top.
  const [pour, setPour] = useState(null); // 'up' (to create account) or 'in' (to sign in)
  const pouring = useRef(false);
  const switchMode = (toSignUp) => {
    if (toSignUp === isSignUpMode || pouring.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setIsSignUpMode(toSignUp);
    pouring.current = true;
    setPour(toSignUp ? 'up' : 'in');
    setTimeout(() => setIsSignUpMode(toSignUp), 720);
    setTimeout(() => { setPour(null); pouring.current = false; }, 1700);
  };
  const handleSignInClick = () => switchMode(false);
  const handleSignUpClick = () => switchMode(true);

  const handleShowOtp = () => setShowOtp(true);
  const handleHideOtp = (e) => {
    if (e.target.classList.contains("otp-overlay")) {
      setShowOtp(false);
    }
  };

  const startTimer = (setTimer, timer) => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval); // Stop the timer when it reaches 0
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return interval;
    }
  };
  // Handle OTP input change and auto focus next input
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp]; // Copy current OTP state
    newOtp[index] = value; // Update the specific index
    setOtp(newOtp); // Update state

    const otpString = newOtp.join("");
    setNewOtp(otpString)
    if (value && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus(); // Move focus to next input
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };


  const handleLoginReq = async () => {

    if (!userName || !pass) {
      toast.error("Please enter your username and password.")
    } else {
      setLoading(true)
      const res = await req.post('/user/login', { userName, pass })
      setLoading(false)
      if (res.data.errorCode !== '000000') {
        toast.error(res.data.errorDescription)
      } else {
        setUser(res.data.Data[0]);
        nav('/home');
        toast.success("Welcome back! Your drinks are waiting.")

      }
    }
  }

  const handleSignupreq = async () => {
    if (!userMail || !userName || !pass) {
      toast.error("Please fill in your username, email and password.")
    } else {
      setLoading(true)
      const res = await req.post('/user/signup', { userName, userMail, pass });
      setLoading(false)
      if (res.data.errorCode !== "000000") {
        toast.error(res.data.errorDescription);
      } else {
        toast.success("Account created! We've emailed you a 4-digit code.");
        handleShowOtp();
        setUserId(res.data.Data.insertId)
        startTimer(setTimer, 60);

      }


    }
  }
  const handleForgotPassword = async () => {
    if (!userName) return toast.error("Enter your username first, then tap Forgot password.");
    setLoading(true);
    const res = await req.get('/user/getpassword', {
      params: { userName }
    })

    setLoading(false);
    if (res.data.errorCode !== "000000") {
      toast.error(res.data.errorDescription);
    } else {
      toast.success(`Here's your password: ${res.data.Data.pass}`);
    }

  }
  const handleVerfiyOtp = async () => {
    setLoading(true);
    const res = await req.post('user/verifyotp', { userId, otp: newstringOtp })
    setLoading(false);
    if (res.data.errorCode !== "000000") {
      toast.error(res.data.errorDescription);
    } else {
      if (res.data.Data?.[0]) setUser(res.data.Data[0]);
      toast.success(res.data.errorDescription)
      nav('/home')
    }
  }

  const handleResendOtp = async () => {
    if (timer === 0) {
      setLoading(true);
      const res = await req.get('/user/getotp', {
        params: { userId }
      });
      setLoading(false);
      if (res.data.errorCode !== "000000") {
        toast.error(res.data.errorDescription);
      } else {
        toast.success(`Your new code is ${res.data.Data}. It works for 5 minutes.`);
        setNewOtp('');
        setOtp(["", "", "", ""]);
        otpRefs.forEach(ref => ref.current.value = "");
        setTimer(60);
        startTimer(setTimer, 60);
      }
    } else {
      toast.error("Hold on, you can ask for a new code when the timer runs out.");
    }
  }

  // the three cans shown on the left change with the mode
  const cans = isSignUpMode
    ? ['mint-sparkling', 'root-beer', 'peach-iced-tea']
    : ['lime-fizz', 'classic-cola', 'orange-pop'];

  return (
    <div className={`auth ${isSignUpMode ? 'is-signup' : ''}`}>
      {/* ---------- left: brand and cans ---------- */}
      <aside className="auth-art">
        <div className="auth-brand">
          <img src="/img/brand/mark-lemon.svg" alt="" />
          <span>Two Tone</span>
        </div>

        <div className="auth-copy" key={isSignUpMode ? 'up' : 'in'}>
          <h2>{isSignUpMode ? <>Your first round<br />is on its way.</> : <>Cold drinks,<br />poured two ways.</>}</h2>
          <p>{isSignUpMode
            ? 'Create an account to save favourites, build 12-packs and get new flavours first.'
            : 'Small-batch sodas and iced teas, shipped cold to your door.'}</p>
        </div>

        <div className="auth-cans" key={cans.join()}>
          {cans.map((c, i) => (
            <img key={c} src={`/img/products/${c}.png`} alt="" style={{ '--i': i }} />
          ))}
          <span className="auth-floor" />
        </div>

        <p className="auth-foot">Sodas &amp; teas · Crafted cold</p>
      </aside>

      {/* ---------- right: the form is printed on a giant can ---------- */}
      <main className="auth-panel">
        <div className="can-scene">
          <div className={`can ${isSignUpMode ? 'can-lemon' : 'can-teal'}`}>
            {/* lid with its ring pull */}
            <div className="can-lid">
              <span className="can-tab" />
            </div>
            <span className="can-rim top" />

            <div className="can-body">
              {/* drops of condensation */}
              {[[12, 18], [86, 30], [8, 62], [91, 74], [16, 88], [80, 52]].map(([x, y], k) => (
                <i key={k} className="can-drop" style={{ left: `${x}%`, top: `${y}%`, '--k': k }} />
              ))}

              <div className="can-label" key={isSignUpMode ? 'up' : 'in'}>
                <div className="can-brand">
                  <img src={isSignUpMode ? '/img/brand/mark-teal.svg' : '/img/brand/mark-lemon.svg'} alt="" />
                  <span>Two Tone</span>
                </div>

                <div className="can-switch" role="tablist">
                  <button type="button" role="tab" aria-selected={!isSignUpMode} onClick={handleSignInClick}>Sign in</button>
                  <i />
                  <button type="button" role="tab" aria-selected={isSignUpMode} onClick={handleSignUpClick}>Join</button>
                </div>

                <h1>{isSignUpMode ? <>Join the<br />club</> : <>Welcome<br />back</>}</h1>

                <form className="can-form" onSubmit={(e) => { e.preventDefault(); isSignUpMode ? handleSignupreq() : handleLoginReq(); }}>
                  <label className="can-field">
                    <span>Username</span>
                    <input type="text" autoComplete="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  </label>
                  {isSignUpMode && (
                    <label className="can-field">
                      <span>Email</span>
                      <input type="email" autoComplete="email" value={userMail} onChange={(e) => setUserMail(e.target.value)} />
                    </label>
                  )}
                  <label className="can-field">
                    <span>Password</span>
                    <input type="password" autoComplete={isSignUpMode ? 'new-password' : 'current-password'} value={pass} onChange={(e) => setPass(e.target.value)} />
                  </label>

                  <button type="submit" className="can-go">
                    {isSignUpMode ? 'Crack it open' : 'Pop the tab'}
                    <span aria-hidden="true">→</span>
                  </button>
                  {!isSignUpMode && <button type="button" className="can-forgot" onClick={handleForgotPassword}>Forgot password?</button>}
                </form>

                <div className="can-small">
                  <span>330 ml</span>
                  <span>{isSignUpMode ? 'New member · Est. ' + new Date().getFullYear() : 'Members only'}</span>
                </div>
              </div>
            </div>

            <span className="can-rim bottom" />
          </div>
          <span className="can-floor" />
        </div>
      </main>

      {/* ---------- the pour between modes ---------- */}
      {pour && (
        <div className={`auth-liquid pour-${pour}`} aria-hidden="true">
          <div className="liquid back"><i className="wave top" /><i className="wave bottom" /></div>
          <div className="liquid front">
            <i className="wave top" /><i className="wave bottom" />
            {Array.from({ length: 14 }, (_, k) => (
              <span key={k} className="bubble" style={{ '--x': `${(k * 37) % 100}%`, '--s': `${6 + (k * 7) % 16}px`, '--d': `${(k % 5) * 0.12}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* ---------- one-time code ---------- */}
      {showOtp && (
        <div className="otp-overlay" onClick={handleHideOtp}>
          <div className="otp-container">
            <img src="/img/brand/emblem.svg" alt="" className="otp-emblem" />
            <h4>Check your inbox</h4>
            <p>We sent a 4-digit code to {userMail || 'your email'}.</p>

            <div className="auth-pin-wrap">
              {otpRefs.map((ref, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="code-input"
                  ref={ref}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>

            <button type="button" className="auth-pour" onClick={handleVerfiyOtp}><span className="auth-pour-fill" aria-hidden="true" /><span className="auth-pour-text">Confirm</span><span className="auth-pour-arrow" aria-hidden="true">→</span></button>
            <p className="countdown">
              {timer > 0 ? <>Resend code in {timer}s</> : <>Didn't get it? <button type="button" className="auth-link strong" onClick={handleResendOtp}>Send again</button></>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
