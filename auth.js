// ==================================================
// Supabase ক্লায়েন্ট ইনিশিয়ালাইজেশন
// ==================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// আপনার Supabase URL এবং Anon Key এখানে দিন
const supabaseUrl = "https://wurfwhijekfehgvsamsx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cmZ3aGlqZWtmZWhndnNhbXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTIxNjMsImV4cCI6MjA2NzUyODE2M30.WINhgSiyoWLjTeDuj1rHDt-BDzvsUT88ktKerIRfG_I";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================================================
// DOM এলিমেন্ট নির্বাচন
// ==================================================
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLogin = document.getElementById('back-to-login');

const googleLoginBtn = document.getElementById('google-login-btn');
const toastContainer = document.getElementById('auth-toast-container');
const passwordToggles = document.querySelectorAll('.toggle-password');
const signupPasswordInput = document.getElementById('signup-password');
const strengthIndicator = document.getElementById('password-strength-indicator');
const strengthBar = strengthIndicator.querySelector('.strength-bar');
const strengthText = strengthIndicator.querySelector('.strength-text');


// ==================================================
// হেল্পার ফাংশন: টোস্ট নোটিফিকেশন
// ==================================================
function showAuthToast(message, type = 'success') {
    const toast = document.createElement('div');
    // style.css এর ক্লাসগুলো এখানে ব্যবহার করা হচ্ছে
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 5000); // সময় বাড়ানো হলো
    }, 4000);
}

// ==================================================
// ফর্ম পরিবর্তন (Switching Forms)
// ==================================================
function switchForm(formToShow) {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    formToShow.style.display = 'block';
}

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(signupForm);
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(loginForm);
});

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(forgotPasswordForm);
});

backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(loginForm);
});

// ==================================================
// পাসওয়ার্ড দেখা/লুকানো (Password Visibility Toggle)
// ==================================================
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = toggle.previousElementSibling;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggle.classList.toggle('fa-eye');
        toggle.classList.toggle('fa-eye-slash');
    });
});

// ==================================================
// পাসওয়ার্ডের শক্তি যাচাই (Password Strength Checker)
// ==================================================
signupPasswordInput.addEventListener('input', () => {
    const password = signupPasswordInput.value;
    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    switch (strength) {
        case 0:
        case 1:
            feedback = 'খুব দুর্বল';
            strengthBar.style.width = '20%';
            strengthBar.style.backgroundColor = '#ef4444'; // Red
            break;
        case 2:
            feedback = 'দুর্বল';
            strengthBar.style.width = '40%';
            strengthBar.style.backgroundColor = '#f97316'; // Orange
            break;
        case 3:
            feedback = 'মাঝারি';
            strengthBar.style.width = '60%';
            strengthBar.style.backgroundColor = '#facc15'; // Yellow
            break;
        case 4:
            feedback = 'শক্তিশালী';
            strengthBar.style.width = '80%';
            strengthBar.style.backgroundColor = '#22c55e'; // Green
            break;
        case 5:
            feedback = 'খুব শক্তিশালী';
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = '#16a34a'; // Dark Green
            break;
    }
    strengthText.textContent = `পাসওয়ার্ডের শক্তি: ${feedback}`;
});


// ==================================================
// ফর্ম সাবমিট হ্যান্ডলার
// ==================================================
async function handleFormSubmit(form, handler) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> প্রসেসিং...';
        
        try {
            await handler();
        } catch (error) {
            showAuthToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// সাইনআপ
handleFormSubmit(signupForm, async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        showAuthToast(error.message, 'error');
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        showAuthToast('এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। অনুগ্রহ করে লগইন করুন।', 'error');
    } else {
        showAuthToast('সাইন আপ সফল হয়েছে! আপনার ইমেইল চেক করে অ্যাকাউন্ট ভেরিফাই করুন।', 'success');
        signupForm.reset();
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
    }
});

// লগইন
handleFormSubmit(loginForm, async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        showAuthToast('ভুল ইমেইল অথবা পাসওয়ার্ড।', 'error');
    } else {
        // লগইন সফল হলে লগইন হিস্টোরি যোগ করা হবে
        await supabase.rpc('add_login_activity', {
            ip_address_param: '0.0.0.0', // ক্লায়েন্ট সাইড থেকে IP পাওয়া নির্ভরযোগ্য নয়
            user_agent_param: navigator.userAgent
        });
        window.location.href = 'index.html';
    }
});

// পাসওয়ার্ড রিসেট
handleFormSubmit(forgotPasswordForm, async () => {
    const email = document.getElementById('forgot-email').value;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password.html', // পাসওয়ার্ড আপডেটের জন্য নতুন পেজ
    });

    if (error) {
        showAuthToast(error.message, 'error');
    } else {
        showAuthToast('আপনার ইমেইলে পাসওয়ার্ড রিসেট করার লিঙ্ক পাঠানো হয়েছে।', 'success');
        forgotPasswordForm.reset();
        switchForm(loginForm);
    }
});

// ==================================================
// সামাজিক লগইন (Social Login)
// ==================================================
googleLoginBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) {
        showAuthToast(`গুগল লগইন এ সমস্যা হয়েছে: ${error.message}`, 'error');
    }
});

// ==================================================
// সেশন চেক
// ==================================================
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // যদি ব্যবহারকারী লগইন অবস্থায় login.html পেজে আসে, তাকে index.html এ পাঠিয়ে দেওয়া হবে।
        window.location.href = 'index.html';
    }
});
