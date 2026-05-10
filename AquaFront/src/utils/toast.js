import Swal from 'sweetalert2';

// Cấu hình Toast mặc định
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

export const notify = {
    success: (message) => {
        Toast.fire({
            icon: 'success',
            title: message,
            background: '#f0fdf4', // Teal light
            color: '#134e4a',
            iconColor: '#0d9488'
        });
    },
    error: (message) => {
        Toast.fire({
            icon: 'error',
            title: message,
            background: '#fef2f2', // Red light
            color: '#7f1d1d',
            iconColor: '#dc2626'
        });
    },
    warning: (message) => {
        Toast.fire({
            icon: 'warning',
            title: message,
            background: '#fffbeb', // Amber light
            color: '#78350f',
            iconColor: '#d97706'
        });
    },
    info: (message) => {
        Toast.fire({
            icon: 'info',
            title: message,
            background: '#eff6ff', // Blue light
            color: '#1e3a8a',
            iconColor: '#2563eb'
        });
    },
    // Dành cho các hộp thoại xác nhận (Confirm)
    confirm: async (title, text, icon = 'warning') => {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: '#0d9488', // Teal 600
            cancelButtonColor: '#64748b', // Slate 500
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
            background: '#ffffff',
            borderRadius: '16px',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg px-6 py-2 font-bold',
                cancelButton: 'rounded-lg px-6 py-2 font-bold'
            }
        });
        return result.isConfirmed;
    },
    // Dành cho thông báo quan trọng giữa màn hình
    alert: (title, text, icon = 'info') => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonColor: '#0d9488',
            confirmButtonText: 'Đã hiểu',
            background: '#ffffff',
            borderRadius: '16px'
        });
    }
};

export default notify;
