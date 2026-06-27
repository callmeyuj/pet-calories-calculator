// ========== 动态步骤配置（步骤 4-8）==========
const STEP_CONFIGS = {
    4: {
        dog: {
            title: '运动时长',
            desc: '宝贝每天的运动量如何？',
            key: 'exercise',
            options: [
                { value: 'light', label: '🚶 轻度运动（每天 < 1小时）' },
                { value: 'moderate', label: '🏃 中度运动（1 ~ 3 小时/天）' },
                { value: 'high', label: '🏋️ 高强度工作 / 赛犬' }
            ]
        },
        cat: {
            title: '是否户外散养',
            desc: '宝贝是否有户外散养的情况？',
            key: 'outdoor',
            options: [
                { value: 'yes', label: '🌳 是，会出门活动' },
                { value: 'no', label: '🏠 否，纯室内' }
            ]
        }
    },
    5: {
        dog: {
            key: 'bodyCondition',
            options: [
                { value: 'severe', label: '🐷 肥胖<br><small>圆润，俯视无腰身，肋骨摸不到</small>' },
                { value: 'overweight', label: '🐶 超重<br><small>微胖，腰身模糊，肋骨不易摸到</small>' },
                { value: 'normal', label: '🐕 标准<br><small>匀称，腰身明显，肋骨可摸不可见</small>' },
                { value: 'thin', label: '🦮 偏瘦<br><small>削瘦，腰身极细，肋骨可见</small>' }
            ]
        },
        cat: {
            key: 'bodyCondition',
            options: [
                { value: 'severe', label: '🐷 肥胖<br><small>圆润，俯视无腰身，肋骨摸不到</small>'},
                { value: 'normal', label: '🐈 标准<br><small>匀称，腰身明显，肋骨可摸不可见</small>' },
                { value: 'thin', label: '🐈‍⬛ 偏瘦<br><small>削瘦，腰身极细，肋骨可见</small>'}
            ]
        }
    },
    6: {
        dog: {
            key: 'age',
            options: [
                { value: 'baby', label: '🍼 宝宝（4个月以下）' },
                { value: 'kid', label: '🐾 幼犬（4 ~ 12个月）' },
                { value: 'adult', label: '🐕 成年犬（1 ~ 7岁）' },
                { value: 'senior', label: '🦯 老年犬（≥ 7岁）' }
            ]
        },
        cat: {
            key: 'age',
            options: [
                { value: 'baby', label: '🍼 宝宝（4个月以下）' },
                { value: 'young', label: '🐾 幼猫（4 ~ 12个月）' },
                { value: 'adult', label: '🐈 成年猫（1 ~ 7岁）' },
                { value: 'senior', label: '🦯 老年猫（≥ 7岁）' }
            ]
        }
    },
    7: {
        dog: {
            desc: '宝贝目前是否怀孕或哺乳？',
            key: 'pregnant',
            options: [
                { value: 'early', label: '怀孕期' },
                { value: 'late', label: '哺乳期' },
                { value: 'none', label: '非孕/哺乳期' }
            ]
        },
        cat: {
            desc: '宝贝目前是否怀孕？',
            key: 'pregnant',
            options: [
                { value: 'yes', label: '是，正在怀孕期' },
                { value: 'no', label: '否' }
            ]
        }
    },
    8: {
        dog: {
            desc: '狗狗是否处于术后恢复期？',
            key: 'postSurgery',
            options: [
                { value: 'spay', label: '绝育手术后一周内' },
                { value: 'other', label: '其他重症术后一周内' },
                { value: 'none', label: '健康状态（非术后）' }
            ]
        },
        cat: {
            desc: '猫咪是否处于术后恢复期？',
            key: 'postSurgery',
            options: [
                { value: 'spay', label: '绝育手术后一周内' },
                { value: 'other', label: '其他重症术后一周内' },
                { value: 'none', label: '健康状态（非术后）' }
            ]
        }
    }
};

// DOM 元素 ID 映射
const STEP_ELEMENT_IDS = {
    4: { title: 'step4Title', desc: 'step4Desc', options: 'step4Options' },
    5: { options: 'bodyOptions' },
    6: { options: 'ageOptions' },
    7: { desc: 'pregDesc', options: 'pregOptions' },
    8: { desc: 'step8Desc', options: 'step8Options' }
};

// ========== 系数计算规则链 ==========
const COEFFICIENT_RULES = {
    dog: [
        {
            name: '运动+绝育',
            apply: (state) => {
                if (state.exercise === 'light') {
                    return state.neutered === 'yes'
                        ? { coeff: 1.2, note: '绝育犬轻度运动 1.2' }
                        : { coeff: 1.4, note: '未绝育犬轻度运动 1.4' };
                }
                if (state.exercise === 'moderate') {
                    return state.neutered === 'yes'
                        ? { coeff: 1.6, note: '绝育犬中度运动 1.6' }
                        : { coeff: 1.8, note: '未绝育犬中度运动 1.8' };
                }
                return { coeff: 2.0, note: '高强度运动 2.0' };
            }
        },
        {
            name: '体型',
            apply: (state, prev) => {
                if (state.bodyCondition === 'severe') return { coeff: 1.0, note: '严重超重 1' };
                if (state.bodyCondition === 'overweight') return { coeff: 1.2, note: '超重 1.2' };
                if (state.bodyCondition === 'thin') return { coeff: 2.0, note: '偏瘦 2' };
                return { coeff: prev.coeff, note: prev.note + ' → 正常体型(继承)' };
            }
        },
        {
            name: '年龄',
            apply: (state, prev) => {
                if (state.age === 'baby') return { coeff: 3.0, note: '宝宝犬 3.0' };
                if (state.age === 'kid') return { coeff: 2.0, note: '幼犬 2.0' };
                if (state.age === 'senior') return { coeff: 1.2, note: '老年犬 1.2' };
                return { coeff: prev.coeff, note: prev.note + ' → 成年犬(继承)' };
            }
        },
        {
            name: '孕哺',
            apply: (state, prev) => {
                if (state.pregnant === 'early') return { coeff: 1.8, note: '怀孕期 1.8' };
                if (state.pregnant === 'late') return { coeff: 2.0, note: '哺乳期 2.0' };
                return { coeff: prev.coeff, note: prev.note + ' → 非孕/哺乳期(继承)' };
            }
        },
        {
            name: '术后',
            apply: (state, prev) => {
                if (state.postSurgery === 'spay') return { coeff: 1.4, note: '绝育术后恢复 1.4' };
                if (state.postSurgery === 'other') return { coeff: 1.0, note: '其他术后 1.0' };
                return { coeff: prev.coeff, note: prev.note + ' → 健康状态(继承)' };
            }
        }
    ],
    cat: [
        {
            name: '绝育',
            apply: (state) => {
                return state.neutered === 'yes'
                    ? { coeff: 1.2, note: '已绝育猫 1.2' }
                    : { coeff: 1.4, note: '未绝育猫 1.4' };
            }
        },
        {
            name: '户外',
            apply: (state, prev) => {
                if (state.outdoor === 'yes') return { coeff: 1.6, note: '户外散养 1.6' };
                return { coeff: prev.coeff, note: prev.note + ' → 室内(继承)' };
            }
        },
        {
            name: '体型',
            apply: (state, prev) => {
                if (state.bodyCondition === 'severe') return { coeff: 0.9, note: prev.note + ' → 超重 0.9' };
                if (state.bodyCondition === 'thin') return { coeff: 1.4, note: prev.note + ' → 偏瘦 1.4' };
                return { coeff: prev.coeff, note: prev.note + ' → 正常体重(继承)' };
            }
        },
        {
            name: '年龄',
            apply: (state, prev) => {
                if (state.age === 'baby') return { coeff: 2.7, note: '宝宝猫 2.7' };
                if (state.age === 'young') return { coeff: 2.0, note: '幼猫 2.0' };
                if (state.age === 'senior') return { coeff: 1.0, note: '老年猫 1.0' };
                return { coeff: prev.coeff, note: prev.note + ' → 成年猫(继承)' };
            }
        },
        {
            name: '怀孕',
            apply: (state, prev) => {
                if (state.pregnant === 'yes') return { coeff: 2.5, note: '怀孕期 2.5' };
                return { coeff: prev.coeff, note: prev.note + ' → 非孕期(继承)' };
            }
        },
        {
            name: '术后',
            apply: (state, prev) => {
                if (state.postSurgery === 'spay') return { coeff: 1.2, note: '绝育术后恢复 1.2' };
                if (state.postSurgery === 'other') return { coeff: 1.0, note: '其他术后 1.0' };
                return { coeff: prev.coeff, note: prev.note + ' → 健康状态(继承)' };
            }
        }
    ]
};

// ========== 产品数据 ==========
const PRODUCT_DATA = {
    dog: [
        { name: '鸡肉鳕鱼', grams: 120, kcal: 121 },
        { name: '猪肉蓝莓', grams: 120, kcal: 149 },
        { name: '嫩牛牡蛎', grams: 120, kcal: 144 },
        { name: '野牧鹿肉', grams: 120, kcal: 154 },
        { name: '平均数据', grams: 120, kcal: 142 }
    ],
    cat: [
        { name: '鸡肉鳕鱼', grams: 100, kcal: 107 },
        { name: '猪肉蓝莓', grams: 100, kcal: 111 },
        { name: '嫩牛牡蛎', grams: 100, kcal: 127 },
        { name: '野牧鹿肉', grams: 100, kcal: 132 },
        { name: '平均数据', grams: 100, kcal: 119 }
    ]
};
const CALORIE_DEFICIT_RATIO = 0.95;

// ========== 状态管理 ==========
const INITIAL_STATE = {
    petType: null, weight: null, gender: null, neutered: null,
    exercise: null, outdoor: null, bodyCondition: null, age: null,
    pregnant: null, postSurgery: null
};

let state = { ...INITIAL_STATE };
let currentStep = 0;
let currentMER = 0;

// ========== DOM 元素缓存 ==========
const els = {};

function cacheElements() {
    const ids = [
        'weightInput', 'progressBar',
        'btnNext0', 'btnNext1', 'btnNext2', 'btnNext3', 'btnNext4',
        'btnNext5', 'btnNext6', 'btnNext7', 'btnNext8',
        'step4Title', 'step4Desc', 'step4Options',
        'bodyOptions', 'ageOptions', 'pregDesc', 'pregOptions',
        'step8Desc', 'step8Options',
        'resultIcon', 'resultValue', 'detailPet', 'detailWeight',
        'detailRER', 'detailCoeff', 'resultNoteContent',
        'btnFeedingCalc', 'btnBackResult',
        'feedingIcon', 'feedingMerValue', 'suggestionBody',
        'customCalorieInput', 'customResult'
    ];
    ids.forEach(id => els[id] = document.getElementById(id));
}

// ========== 流程控制 ==========
function getStepFlow() {
    let flow = [0, 1, 2, 3, 4, 5, 6];
    if (state.gender === 'female' && state.neutered === 'no' &&
        (state.age === 'adult' || state.age === 'senior')) {
        flow.push(7);
    }
    flow.push(8, 9);
    return flow;
}

function getStepKey(stepNum) {
    const keyMap = {
        2: 'gender', 3: 'neutered',
        4: state.petType === 'dog' ? 'exercise' : 'outdoor',
        5: 'bodyCondition', 6: 'age', 7: 'pregnant', 8: 'postSurgery'
    };
    return keyMap[stepNum] || null;
}

// ========== UI 渲染 ==========
function renderStepOptions(stepNum) {
    const config = STEP_CONFIGS[stepNum]?.[state.petType];
    const ids = STEP_ELEMENT_IDS[stepNum];
    if (!config || !ids) return;

    if (config.title && ids.title) els[ids.title].textContent = config.title;
    if (config.desc && ids.desc) els[ids.desc].textContent = config.desc;
    if (ids.options) {
        els[ids.options].innerHTML = config.options.map(opt => `
            <div class="option-btn" data-step="${stepNum}" data-key="${config.key}" data-value="${opt.value}">
                <span class="dot"></span>
                <span class="option-label">${opt.label}</span>
            </div>
        `).join('');
    }
}

function buildProgressBar() {
    const bar = els.progressBar;
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
    const steps = document.querySelectorAll('.progress-step');
    for (let i = 0; i < steps.length; i++) {
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
    if (STEP_CONFIGS[stepNum]) {
        renderStepOptions(stepNum);
    } else if (stepNum === 9) {
        showResult();
    }
    if (getStepKey(stepNum) !== null) restoreSelection(stepNum);
}

function restoreSelection(stepNum) {
    const key = getStepKey(stepNum);
    if (key && state[key] !== null) {
        const stepEl = document.getElementById('step-' + stepNum);
        stepEl.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.getAttribute('data-value') === state[key]);
        });
        const btnNext = els['btnNext' + stepNum];
        if (btnNext) btnNext.disabled = false;
    }
}

// ========== 业务逻辑 ==========
function calculateCoefficient() {
    const rules = COEFFICIENT_RULES[state.petType];
    let result = { coeff: 1.0, note: '' };
    const trail = [];
    for (const rule of rules) {
        result = rule.apply(state, result);
        trail.push(`${rule.name}: ${result.note}`);
    }
    return { ...result, trail: trail };
}

function showResult() {
    const { coeff, trail } = calculateCoefficient();
    const rer = 70 * Math.pow(state.weight, 0.75);
    const mer = rer * coeff;
    currentMER = mer;

    els.resultIcon.textContent = state.petType === 'dog' ? '🐶' : '🐱';
    els.resultValue.textContent = Math.round(mer);
    els.detailPet.textContent = state.petType === 'dog' ? '犬' : '猫';
    els.detailWeight.textContent = state.weight + ' kg';
    els.detailRER.textContent = Math.round(rer) + ' 千卡';
    els.detailCoeff.textContent = coeff.toFixed(1);
    var finalStep = trail[trail.length - 1] || '';
    var stepContent = finalStep.replace(/^[^:]+:\s*/, '');
    var trailHtml = '<div class="trail-step">→ ' + stepContent + '</div>';
    els.resultNoteContent.innerHTML =
        '* MER = RER × 推导系数<br>' +
        '* RER = 70 × ' + state.weight + 'kg<sup>0.75</sup> = ' + Math.round(rer) + ' 千卡<br>' +
        '* 推导系数 = ' + coeff.toFixed(1) +
        '<div class="trail-list">' + trailHtml + '</div>';

    renderBrandSuggestions();
}

// ========== 喂食量计算 ==========
function renderBrandSuggestions() {
    const products = PRODUCT_DATA[state.petType];
    const adjustedMER = currentMER * CALORIE_DEFICIT_RATIO;

    els.suggestionBody.innerHTML = products.map(product => {
        const packs = roundToHalf(adjustedMER / product.kcal);
        const isAverage = product.name === '平均数据';
        return `
            <div class="suggestion-row ${isAverage ? 'average-row' : ''}">
                <span class="col-flavor">${product.name}</span>
                <span class="col-kcal">${product.kcal} kcal</span>
                <span class="col-grams">${product.grams}g</span>
                <span class="col-packs">${packs.toFixed(1)} 包</span>
            </div>
        `;
    }).join('');
}

function goToFeedingPage() {
    els.feedingIcon.textContent = state.petType === 'dog' ? '🐶' : '🐱';
    els.feedingMerValue.textContent = Math.round(currentMER);
    renderBrandSuggestions();
    els.progressBar.style.display = 'none';
    showStep(10);
}

function backToResult() {
    els.progressBar.style.display = '';
    showStep(9);
}

function onCustomCalorieInput(e) {
    const kcalPerPack = parseFloat(e.target.value);

    if (kcalPerPack > 0 && currentMER > 0) {
        const adjustedMER = currentMER * CALORIE_DEFICIT_RATIO;
        const packs = roundToHalf(adjustedMER / kcalPerPack);
        els.customResult.innerHTML = `每天建议喂食 <strong>${packs.toFixed(1)} 包</strong>`;
        els.customResult.classList.add('show');
    } else {
        els.customResult.innerHTML = '';
        els.customResult.classList.remove('show');
    }
}

function roundToHalf(value) {
    return Math.round(value * 2) / 2;
}

// ========== 事件处理 ==========
function selectPet(type) {
    state.petType = type;
    document.querySelectorAll('.pet-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.pet-card[data-pet="${type}"]`).classList.add('selected');
    els.btnNext0.disabled = false;
}

function onWeightInput() {
    const val = parseFloat(els.weightInput.value);
    state.weight = val > 0 ? val : null;
    els.btnNext1.disabled = !(val > 0);
}

function selectOption(step, key, value) {
    state[key] = value;
    const stepEl = document.getElementById('step-' + step);
    stepEl.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    const clickedBtn = stepEl.querySelector(`.option-btn[data-value="${value}"]`);
    if (clickedBtn) clickedBtn.classList.add('selected');
    const btnNext = els['btnNext' + step];
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

function restart() {
    state = { ...INITIAL_STATE };
    currentMER = 0;
    els.weightInput.value = '';
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('[id^="btnNext"]').forEach(btn => btn.disabled = true);
    els.customCalorieInput.value = '';
    els.customResult.innerHTML = '';
    els.customResult.classList.remove('show');
    buildProgressBar();
    showStep(0);
}

// ========== 初始化 ==========
cacheElements();

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

els.weightInput.addEventListener('input', onWeightInput);
els.btnFeedingCalc.addEventListener('click', goToFeedingPage);
els.btnBackResult.addEventListener('click', backToResult);
els.customCalorieInput.addEventListener('input', onCustomCalorieInput);

document.querySelector('.result-note').addEventListener('toggle', function(e) {
    var isOpen = e.target.open;
    var target = isOpen
        ? document.getElementById('btnFeedingCalc')
        : document.querySelector('.header-icon');
    var delay = isOpen ? 200 : 500;
    setTimeout(function() {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay);
});

buildProgressBar();
