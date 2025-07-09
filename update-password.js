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
const updatePasswordForm = document.getElementById('update-password-form');
const newPasswordInput = document.getElementById('new-password');
const toastContainer = document.getElementById('auth-toast-container');
const passwordToggle = document.querySelector('.toggle-password');
const formInfoText = document.getElementById('form-info-text');

// ==================================================
// হেল্পার ফাংশন: টোস্ট নোটিফিকেশন
// ==================================================
function showAuthToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 5000);
    }, 4000);
}

// ==================================================
// পাসওয়ার্ড দেখা/লুকানো
// ==================================================
passwordToggle.addEventListener('click', () => {
    const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    newPasswordInput.setAttribute('type', type);
    passwordToggle.classList.toggle('fa-eye');
    passwordToggle.classList.toggle('fa-eye-slash');
});

// ==================================================
// পাসওয়ার্ড আপডেট ফর্ম হ্যান্ডলার
// ==================================================
updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = newPasswordInput.value;
    const submitBtn = updatePasswordForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> আপডেট হচ্ছে...';

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
        showAuthToast(`ত্রুটি: ${error.message}`, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    } else {
        showAuthToast('আপনার পাসওয়ার্ড সফলভাবে আপডেট হয়েছে। এখন লগইন করুন।', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    }
});

// ==================================================
// সেশন রিকভারি চেক
// ==================================================
supabase.auth.onAuthStateChange(async (event, session) => {
    // এই পেজটি শুধুমাত্র পাসওয়ার্ড রিকভারি করার জন্য ব্যবহৃত হবে
    if (event === 'PASSWORD_RECOVERY') {
        formInfoText.textContent = 'আপনি এখন একটি নতুন পাসওয়ার্ড সেট করতে পারেন।';
    } else if (session) {
        // যদি ব্যবহারকারী কোনোভাবে লগইন অবস্থায় এই পেজে আসে
        showAuthToast('আপনি ইতিমধ্যে লগইন করা আছেন।', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});
