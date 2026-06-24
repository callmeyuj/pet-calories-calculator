         let state = {
            petType: null, weight: null, gender: null, neutered: null,
            exercise: null, outdoor: null, bodyCondition: null, age: null,
            pregnant: null, postSurgery: null
        };

        let currentStep = 0;

        function getStepFlow() {
            let flow = [0, 1, 2, 3, 4, 5, 6];
            if (state.gender === 'female' && state.neutered === 'no' &&
                (state.age === 'adult' || state.age === 'senior')) {
                flow.push(7);
            }
            flow.push(8, 9);
            return flow;
        }

        function buildProgressBar() {
            const bar = document.getElementById('progressBar');
            const flow = getStepFlow();
            const stepCount = flow.length - 1;
            bar.innerHTML = '';
            for (let i = 0; i < stepCount; i++) {
                const div = document.createElement('div');
                div.className = 'progress-step';
                div.id = 'prog-' + i;
                bar.appendChild(div);
            }
            updateProgress();
        }

        function updateProgress() {
            const flow = getStepFlow();
            const currentIdx = flow.indexOf(currentStep);
            for (let i = 0; i < document.querySelectorAll('.progress-step').length; i++) {
                const el = document.getElementById('prog-' + i);
                if (!el) continue;
                el.classList.remove('active', 'done');
                if (i < currentIdx) el.classList.add('done');
                else if (i === currentIdx) el.classList.add('active');
            }
        }

        function showStep(stepNum) {
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            const stepEl = document.getElementById('step-' + stepNum);
            if (stepEl) {
                stepEl.classList.add('active');
                stepEl.style.animation = 'none';
                stepEl.offsetHeight;
                stepEl.style.animation = '';
            }
            currentStep = stepNum;
            updateProgress();
            configureStep(stepNum);
        }

        function configureStep(stepNum) {
            if (stepNum === 4) configureStep4();
            else if (stepNum === 5) configureStep5();
            else if (stepNum === 6) configureStep6();
            else if (stepNum === 7) configureStep7();
            else if (stepNum === 8) configureStep8();
            else if (stepNum === 9) showResult();

            if ([2, 3, 4, 5, 6, 7, 8].includes(stepNum)) restoreSelection(stepNum);
        }

        function configureStep4() {
            const title = document.getElementById('step4Title');
            const desc = document.getElementById('step4Desc');
            const opts = document.getElementById('step4Options');

            if (state.petType === 'dog') {
                title.textContent = '运动时长';
                desc.textContent = '宝贝每天的运动量如何？';
                opts.innerHTML = `
                    <div class="option-btn" data-step="4" data-key="exercise" data-value="light">
                        <span class="dot"></span> 🚶 轻度运动（每天 &lt; 1小时）
                    </div>
                    <div class="option-btn" data-step="4" data-key="exercise" data-value="moderate">
                        <span class="dot"></span> 🏃 中度运动（1 ~ 3 小时/天）
                    </div>
                    <div class="option-btn" data-step="4" data-key="exercise" data-value="high">
                        <span class="dot"></span> 🏋️ 高强度工作 / 赛犬
                    </div>`;
            } else {
                title.textContent = '是否户外散养';
                desc.textContent = '宝贝是否有户外散养的情况？';
                opts.innerHTML = `
                    <div class="option-btn" data-step="4" data-key="outdoor" data-value="yes">
                        <span class="dot"></span> 🌳 是，会出门活动
                    </div>
                    <div class="option-btn" data-step="4" data-key="outdoor" data-value="no">
                        <span class="dot"></span> 🏠 否，纯室内
                    </div>`;
            }
        }

        function configureStep5() {
            const opts = document.getElementById('bodyOptions');
            if (state.petType === 'dog') {
                opts.innerHTML = `
                    <div class="option-btn" data-step="5" data-key="bodyCondition" data-value="severe">
                        <span class="dot"></span> 严重超重
                    </div>
                    <div class="option-btn" data-step="5" data-key="bodyCondition" data-value="overweight">
                        <span class="dot"></span> 超重
                    </div>
                    <div class="option-btn" data-step="5" data-key="bodyCondition" data-value="normal">
                        <span class="dot"></span> 正常体型
                    </div>
                    <div class="option-btn" data-step="5" data-key="bodyCondition" data-value="thin">
                        <span class="dot"></span> 偏瘦
                    </div>`;
            } else {
                opts.innerHTML = `
                    <div class="option-btn" data-step="5" data-key="bodyCondition" data-value="severe">
                        <span class="dot"></span> 超重
                    </div>
                    <div class="option-btn" data-step="5" data-key="bodyCondition" data-value="normal">
                        <span class="dot"></span> 正常体型
                    </div>
                    <div class="option-btn" data-step="5" data-key="bodyCondition" data-value="thin">
                        <span class="dot"></span> 偏瘦
                    </div>`;
            }
        }

        function configureStep6() {
            const opts = document.getElementById('ageOptions');
            if (state.petType === 'dog') {
                opts.innerHTML = `
                    <div class="option-btn" data-step="6" data-key="age" data-value="baby">
                        <span class="dot"></span> 👶 宝宝（6个月以下）
                    </div>
                    <div class="option-btn" data-step="6" data-key="age" data-value="kid">
                        <span class="dot"></span> 🐕 幼犬（6 ~ 12个月）
                    </div>
                    <div class="option-btn" data-step="6" data-key="age" data-value="adult">
                        <span class="dot"></span> 🐾 成年犬（1 ~ 7岁）
                    </div>
                    <div class="option-btn" data-step="6" data-key="age" data-value="senior">
                        <span class="dot"></span> 🧓 老年犬（≥ 7岁）
                    </div>`;
            } else {
                opts.innerHTML = `
                    <div class="option-btn" data-step="6" data-key="age" data-value="baby">
                        <span class="dot"></span> 👶 宝宝（6个月以下）
                    </div>
                    <div class="option-btn" data-step="6" data-key="age" data-value="young">
                        <span class="dot"></span> 🐈 幼猫（6 ~ 12个月）
                    </div>
                    <div class="option-btn" data-step="6" data-key="age" data-value="adult">
                        <span class="dot"></span> 🐾 成年猫（1 ~ 7岁）
                    </div>
                    <div class="option-btn" data-step="6" data-key="age" data-value="senior">
                        <span class="dot"></span> 🧓 老年猫（≥ 7岁）
                    </div>`;
            }
        }

        function configureStep7() {
            const desc = document.getElementById('pregDesc');
            const opts = document.getElementById('pregOptions');

            if (state.petType === 'dog') {
                desc.textContent = '宝贝目前是否怀孕或哺乳？';
                opts.innerHTML = `
                    <div class="option-btn" data-step="7" data-key="pregnant" data-value="early">
                        <span class="dot"></span> 怀孕期
                    </div>
                    <div class="option-btn" data-step="7" data-key="pregnant" data-value="late">
                        <span class="dot"></span> 哺乳期
                    </div>
                    <div class="option-btn" data-step="7" data-key="pregnant" data-value="none">
                        <span class="dot"></span> 非孕/哺乳期
                    </div>`;
            } else {
                desc.textContent = '宝贝目前是否怀孕？';
                opts.innerHTML = `
                    <div class="option-btn" data-step="7" data-key="pregnant" data-value="yes">
                        <span class="dot"></span> 是，正在怀孕期
                    </div>
                    <div class="option-btn" data-step="7" data-key="pregnant" data-value="no">
                        <span class="dot"></span> 否
                    </div>`;
            }
        }

        function configureStep8() {
            const desc = document.getElementById('step8Desc');
            desc.textContent = (state.petType === 'dog' ? '狗狗' : '猫咪') + '是否处于术后恢复期？';
        }

        function restoreSelection(stepNum) {
            const key = getStepKey(stepNum);
            if (key && state[key] !== null) {
                const stepEl = document.getElementById('step-' + stepNum);
                stepEl.querySelectorAll('.option-btn').forEach(btn => {
                    btn.classList.toggle('selected', btn.getAttribute('data-value') === state[key]);
                });
                const btnNext = document.getElementById('btnNext' + stepNum);
                if (btnNext) btnNext.disabled = false;
            }
        }

        function getStepKey(stepNum) {
            const map = { 2: 'gender', 3: 'neutered', 4: state.petType === 'dog' ? 'exercise' : 'outdoor', 5: 'bodyCondition', 6: 'age', 7: 'pregnant', 8: 'postSurgery' };
            return map[stepNum] || null;
        }

        function selectPet(type) {
            state.petType = type;
            document.querySelectorAll('.pet-card').forEach(c => c.classList.remove('selected'));
            document.querySelector(`.pet-card[data-pet="${type}"]`).classList.add('selected');
            document.getElementById('btnNext0').disabled = false;
        }

        function onWeightInput() {
            const val = parseFloat(document.getElementById('weightInput').value);
            state.weight = val > 0 ? val : null;
            document.getElementById('btnNext1').disabled = !(val > 0);
        }

        function selectOption(step, key, value) {
            state[key] = value;
            const stepEl = document.getElementById('step-' + step);
            stepEl.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            const clickedBtn = stepEl.querySelector(`.option-btn[data-value="${value}"]`);
            if (clickedBtn) clickedBtn.classList.add('selected');
            const btnNext = document.getElementById('btnNext' + step);
            if (btnNext) btnNext.disabled = false;
            if (key === 'age' || key === 'gender' || key === 'neutered') buildProgressBar();
        }

        function nextStep() {
            const flow = getStepFlow();
            const currentIdx = flow.indexOf(currentStep);
            if (currentIdx < flow.length - 1) showStep(flow[currentIdx + 1]);
        }

        function prevStep() {
            const flow = getStepFlow();
            const currentIdx = flow.indexOf(currentStep);
            if (currentIdx > 0) showStep(flow[currentIdx - 1]);
        }

        function calculateCoefficient() {
            let coeff = 1.0;
            let coeffLabel = '';

            if (state.petType === 'dog') {
                // 运动量 + 绝育状态组合系数
                if (state.exercise === 'light') {
                    if (state.neutered === 'yes') { coeff = 1.2; coeffLabel = '绝育犬轻度运动 1.2'; }
                    else { coeff = 1.4; coeffLabel = '未绝育犬轻度运动 1.4'; }
                } else if (state.exercise === 'moderate') {
                    if (state.neutered === 'yes') { coeff = 1.6; coeffLabel = '绝育犬中度运动 1.6'; }
                    else { coeff = 1.8; coeffLabel = '未绝育犬中度运动 1.8'; }
                } else if (state.exercise === 'high') {
                    coeff = 2.0; coeffLabel = '高强度运动 2.0';
                }

                // 体型调整
                if (state.bodyCondition === 'severe') { coeff = 1.0; coeffLabel = '严重超重 1'; }
                else if (state.bodyCondition === 'overweight') { coeff = 1.2; coeffLabel = '超重 1.2'; }
                else if (state.bodyCondition === 'normal') { coeffLabel += ' 正常体型 继承系数'; }
                else if (state.bodyCondition === 'thin') { coeff = 2.0; coeffLabel = '偏瘦 2'; }

                // 年龄段
                if (state.age === 'baby') { coeff = 3.0; coeffLabel = '宝宝犬 3.0'; }
                else if (state.age === 'kid') { coeff = 2.0; coeffLabel = '幼犬 2.0'; }
                else if (state.age === 'adult') { coeffLabel += ' 成年犬 继承系数'; }
                else if (state.age === 'senior') { coeff = 1.2; coeffLabel = '老年犬 1.2'; }

                // 怀孕/哺乳
                if (state.pregnant === 'early') { coeff = 1.8; coeffLabel = '怀孕期 1.8'; }
                else if (state.pregnant === 'late') { coeff = 2.0; coeffLabel = '哺乳期 2.0'; }
                else if (state.pregnant === 'none') { coeffLabel += ' 非孕/哺乳期 继承系数'; }

                // 术后恢复期
                if (state.postSurgery === 'spay') { coeff = 1.0; coeffLabel = '绝育术后恢复 1.4'; }
                else if (state.postSurgery === 'other') { coeff = 1.0; coeffLabel = '其他术后 1.0'; }
                else if (state.postSurgery === 'none') { coeffLabel += ' 健康状态 继承系数'; }
            } else {
                // 猫：基础系数
                if (state.neutered === 'yes') { coeff = 1.2; coeffLabel = '已绝育猫 1.2'; }
                else { coeff = 1.4; coeffLabel = '未绝育猫 1.4'; }

                // 户外散养调整
                if (state.outdoor === 'yes') { coeff = 1.6; coeffLabel = '户外散养 1.6'; }

                // 体型调整
                if (state.bodyCondition === 'severe') { coeff = 0.9; coeffLabel += '超重 0.9'; }
                else if (state.bodyCondition === 'normal') { coeffLabel += '正常体重 继承系数'; }
                else if (state.bodyCondition === 'thin') { coeff = 1.4; coeffLabel += '偏瘦 1.4'; }

                // 年龄段
                if (state.age === 'baby') { coeff = 2.7; coeffLabel = '宝宝猫 2.7'; }
                else if (state.age === 'young') { coeff = 2.0; coeffLabel = '幼猫 2.0'; }
                else if (state.age === 'adult') { coeffLabel += ' 成年猫 继承系数'; }
                else if (state.age === 'senior') { coeff = 1.0; coeffLabel = '老年猫 1.0'; }

                // 怀孕期
                if (state.pregnant === 'yes') { coeff = 2.5; coeffLabel = '怀孕期 2.5'; }

                // 术后恢复期
                if (state.postSurgery === 'spay') { coeff = 1.2; coeffLabel = '绝育术后恢复 1.2'; }
                else if (state.postSurgery === 'other') { coeff = 1.0; coeffLabel = '其他术后 1.0'; }
                else if (state.postSurgery === 'none') { coeffLabel += ' 健康状态 继承系数'; }
            }

            return { coeff, coeffLabel };
        }

        function showResult() {
            const { coeff, coeffLabel } = calculateCoefficient();
            const rer = 70 * Math.pow(state.weight, 0.75);
            const mer = rer * coeff;

            document.getElementById('resultIcon').textContent = state.petType === 'dog' ? '🐶' : '🐱';
            document.getElementById('resultValue').textContent = Math.round(mer);
            document.getElementById('detailPet').textContent = state.petType === 'dog' ? '犬' : '猫';
            document.getElementById('detailWeight').textContent = state.weight + ' kg';
            document.getElementById('detailRER').textContent = Math.round(rer) + ' 千卡';
            document.getElementById('detailCoeff').textContent = coeff.toFixed(1);
            document.getElementById('resultNote').innerHTML =
                '* MER = RER × 系数<br>' +
                '* RER = 70 × ' + state.weight + '<sup>0.75</sup> = ' + Math.round(rer) + ' 千卡<br>' +
                '* 系数推导：' + coeffLabel.trim();
        }

        function restart() {
            state = { petType: null, weight: null, gender: null, neutered: null, exercise: null, outdoor: null, bodyCondition: null, age: null, pregnant: null, postSurgery: null };
            document.getElementById('weightInput').value = '';
            document.querySelectorAll('.pet-card').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            for (let i = 0; i <= 8; i++) {
                const btn = document.getElementById('btnNext' + i);
                if (btn) btn.disabled = true;
            }
            buildProgressBar();
            showStep(0);
        }

        document.querySelector('.content').addEventListener('click', function(e) {
            const petCard = e.target.closest('.pet-card');
            if (petCard && petCard.dataset.pet) {
                selectPet(petCard.dataset.pet);
                return;
            }
            const optBtn = e.target.closest('.option-btn');
            if (optBtn && optBtn.dataset.step) {
                selectOption(
                    parseInt(optBtn.dataset.step),
                    optBtn.dataset.key,
                    optBtn.dataset.value
                );
                return;
            }
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                const action = actionBtn.dataset.action;
                if (action === 'next') nextStep();
                else if (action === 'prev') prevStep();
                else if (action === 'restart') restart();
            }
        });

        document.getElementById('weightInput').addEventListener('input', onWeightInput);

        buildProgressBar();
