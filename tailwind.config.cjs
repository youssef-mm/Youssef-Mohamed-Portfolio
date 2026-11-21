const theme = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        dark: {
                            base: '#07080a',
                            surface: '#0f1117',
                            card: 'rgba(15, 17, 23, 0.88)',
                            border: 'rgba(255, 255, 255, 0.08)'
                        },
                        crimson: {
                            DEFAULT: '#e11d48',
                            light: '#f43f5e',
                            dark: '#be123c',
                            glow: 'rgba(225, 29, 72, 0.35)'
                        },
                        platinum: {
                            50: '#fafafa',
                            100: '#f4f4f5',
                            200: '#e4e4e7',
                            400: '#a1a1aa',
                            500: '#71717a'
                        }
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                        arabic: ['Cairo', 'sans-serif']
                    }
                }
            }
        };

module.exports = {
    ...theme,
    content: ['./index.html', './assets/*.js'],
};
