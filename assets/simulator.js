let currentChurnScore = Number.parseInt(document.getElementById('churnScore').textContent, 10);
        let churnAnimFrame = null;

        function animateChurnScore(targetScore) {
            const scoreEl = document.getElementById('churnScore');
            if (!scoreEl) return;
            if (churnAnimFrame) cancelAnimationFrame(churnAnimFrame);

            if (motionPreference.matches) {
                currentChurnScore = targetScore;
                scoreEl.textContent = targetScore + '%';
                return;
            }
            const startScore = currentChurnScore;
            const diff = targetScore - startScore;

            if (diff === 0) {
                scoreEl.textContent = `${targetScore}%`;
                return;
            }

            const duration = 320;
            const startTime = performance.now();

            function update(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                currentChurnScore = Math.round(startScore + diff * eased);
                scoreEl.textContent = `${currentChurnScore}%`;

                if (progress < 1) {
                    churnAnimFrame = requestAnimationFrame(update);
                } else {
                    currentChurnScore = targetScore;
                    scoreEl.textContent = `${targetScore}%`;

                    /* High risk alert shake */
                    if (targetScore >= 65) {
                        scoreEl.classList.add('high-risk-shake');
                        setTimeout(() => scoreEl.classList.remove('high-risk-shake'), 400);
                    }
                }
            }
            churnAnimFrame = requestAnimationFrame(update);
        }

        export function recalcChurn() {

            const spend =
                Number(
                    document.getElementById(
                        'spendInput'
                    ).value
                );

            const tenure =
                Number(
                    document.getElementById(
                        'tenureInput'
                    ).value
                );

            const tickets =
                Number(
                    document.getElementById(
                        'ticketsInput'
                    ).value
                );

            const annual =
                document.getElementById(
                    'contractInput'
                ).checked;

            const autoRenew =
                document.getElementById(
                    'autoBillingInput'
                ).checked;


            document.getElementById(
                'spendVal'
            ).textContent =
                `$${spend}`;

            document.getElementById(
                'tenureVal'
            ).textContent =
                currentLang === 'ar'
                    ? `${tenure} شهر`
                    : `${tenure} months`;

            document.getElementById(
                'ticketsVal'
            ).textContent =
                currentLang === 'ar'
                    ? `${tickets} تذاكر`
                    : `${tickets} tickets`;

            [
                ['spendInput', spend],
                ['tenureInput', tenure],
                ['ticketsInput', tickets]
            ].forEach(([id, value]) => {
                const slider = document.getElementById(id);
                const percent = ((value - Number(slider.min)) / (Number(slider.max) - Number(slider.min))) * 100;
                slider.style.background = `linear-gradient(to ${currentLang === 'ar' ? 'left' : 'right'}, #e11d48 ${percent}%, #27272a ${percent}%)`;
            });


            let score =
                34
                + (tickets * 10)
                - Math.min(28, tenure * 0.72)
                - Math.min(12, spend * 0.025)
                + (annual ? -14 : 10)
                + (autoRenew ? -7 : 6);

            score =
                Math.max(
                    3,
                    Math.min(
                        96,
                        Math.round(score)
                    )
                );


            /* ENHANCEMENT: Smooth count-up/down for churn risk score & circular gauge */
            animateChurnScore(score);
            document.getElementById('churnAnnouncement').textContent = currentLang === 'ar'
                ? 'درجة المخاطر ' + score + ' من 100'
                : 'Risk score ' + score + ' out of 100';

            const churnArc = document.getElementById('churnGaugeArc');
            if (churnArc) {
                const circumference = 452.39;
                const offset = Math.max(0, Math.min(circumference, circumference * (1 - score / 100)));
                churnArc.style.strokeDashoffset = offset;
                if (score < 35) {
                    churnArc.setAttribute('stroke', 'url(#gaugeGradientEmerald)');
                    churnArc.classList.remove('gauge-pulse-high');
                } else if (score < 65) {
                    churnArc.setAttribute('stroke', 'url(#gaugeGradientAmber)');
                    churnArc.classList.remove('gauge-pulse-high');
                } else {
                    churnArc.setAttribute('stroke', 'url(#gaugeGradientRose)');
                    churnArc.classList.add('gauge-pulse-high');
                }
            }

            document.getElementById(
                'churnBar'
            ).style.width =
                `${score}%`;

            document.getElementById(
                'shapT'
            ).textContent =
                `+${tickets * 10} pp`;

            document.getElementById(
                'shapTen'
            ).textContent =
                `-${Math.min(
                    28,
                    Math.round(
                        tenure * 0.72
                    )
                )} pp`;


            const bar =
                document.getElementById(
                    'churnBar'
                );

            const badge =
                document.getElementById(
                    'churnBadge'
                );

            const action =
                document.getElementById(
                    'churnAction'
                );


            if (score < 35) {

                bar.className =
                    'h-full bg-emerald-400 rounded-full transition-all';

                badge.innerHTML = `
                    <span
                        class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                        ${currentLang === 'ar' ? 'خطر منخفض' : 'LOW RISK'}
                    </span>
                `;

                action.innerHTML =
                    currentLang === 'ar'
                        ? '<strong>التوصية:</strong> العميل يبدو مستقراً. مناسب لفرص الاحتفاظ والترقية.'
                        : '<strong>Strategy:</strong> Customer health looks strong. Consider retention and upsell opportunities.';

            } else if (score < 65) {

                bar.className =
                    'h-full bg-amber-400 rounded-full transition-all';

                badge.innerHTML = `
                    <span
                        class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold border border-amber-500/30">
                        ${currentLang === 'ar' ? 'خطر متوسط' : 'MODERATE RISK'}
                    </span>
                `;

                action.innerHTML =
                    currentLang === 'ar'
                        ? '<strong>التوصية:</strong> توجد مؤشرات تحتاج متابعة من فريق نجاح العملاء.'
                        : '<strong>Strategy:</strong> Some friction detected. Consider proactive customer-success outreach.';

            } else {

                bar.className =
                    'h-full bg-rose-500 rounded-full transition-all';

                badge.innerHTML = `
                    <span
                        class="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-bold border border-rose-500/30">
                        ${currentLang === 'ar' ? 'خطر مرتفع' : 'HIGH RISK'}
                    </span>
                `;

                action.innerHTML =
                    currentLang === 'ar'
                        ? '<strong>التوصية:</strong> خطر تسرب مرتفع. يفضل إجراء تدخل احتفاظ استباقي.'
                        : '<strong>Strategy:</strong> High churn likelihood. Trigger a proactive retention workflow.';
            }
        }

        export function loadChurnPreset(kind) {
            const values = kind === 'high'
                ? { spend: 260, tenure: 2, tickets: 9, annual: false, automatic: false }
                : { spend: 55, tenure: 48, tickets: 1, annual: true, automatic: true };
            const set = (id, value) => { const el = document.getElementById(id); if (el) el.value = value; };
            set('spendInput', values.spend); set('tenureInput', values.tenure); set('ticketsInput', values.tickets);
            const annual = document.getElementById('contractInput'); if (annual) annual.checked = values.annual;
            const automatic = document.getElementById('autoBillingInput'); if (automatic) automatic.checked = values.automatic;
            recalcChurn();
            document.getElementById('simulator')?.classList.toggle('preset-high-risk', kind === 'high');
        }
