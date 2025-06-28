module.exports = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#18181b',
                accent: '#6366f1',
                glass: 'rgba(24, 24, 27, 0.7)',
                'glass-80': 'rgba(24, 24, 27, 0.8)',
                'glass-70': 'rgba(24, 24, 27, 0.7)',
                'glass-60': 'rgba(24, 24, 27, 0.6)',
                'glass-50': 'rgba(24, 24, 27, 0.5)',
            },
            boxShadow: {
                glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}; 