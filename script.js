function calculate() {
  // 获取输入值
  const initial = parseFloat(document.getElementById("initial").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const leverage = parseFloat(document.getElementById("leverage").value);
  const target = parseFloat(document.getElementById("target").value);
  const output = document.getElementById("output");

  // 输入验证
  if (isNaN(initial) || isNaN(rate) || isNaN(leverage) || isNaN(target)) {
    output.innerText = "错误：请输入有效的数字！";
    output.classList.add("error");
    return;
  }
  if (initial <= 0 || rate < 0 || leverage < 1 || target <= 0) {
    output.innerText = "错误：本金、目标金额必须大于0，收益率不能为负，杠杆倍数必须大于或等于1！";
    output.classList.add("error");
    return;
  }

  // 初始化变量
  let capital = initial * leverage; // 杠杆后总资本
  const initialDailyReturn = initial * leverage * rate; // 初始每日收益，用于回本计算
  let totalReturn = 0; // 所有每日收益总和，用于回本计算
  let extractedReturn = 0; // 复投后剩余的提取收益
  let days = 0; // 投资天数
  let reinvests = 0; // 复投次数
  let firstBreakEvenDays = null; // 回本所需天数
  const capitalData = [capital.toFixed(2)]; // 图表数据
  const labels = [0]; // 图表标签

  // 模拟每日收益和复投
  while (capital * rate < target) {
    if (days > 10000) { // 防止无限循环
      output.innerText = "错误：计算时间过长，可能无法达到目标！";
      output.classList.add("error");
      return;
    }
    
    // 计算每日收益
    const dailyReturn = capital * rate; // 实际每日收益，考虑复投后的资本
    totalReturn += initialDailyReturn; // 回本计算使用初始每日收益
    extractedReturn += dailyReturn; // 提取收益使用实际每日收益
    capital -= dailyReturn; // 收益从资本中扣除

    // 检查回本（基于初始每日收益）
    if (firstBreakEvenDays === null && totalReturn >= initial - 1) {
      firstBreakEvenDays = days + 1; // 记录回本天数
    }

    // 检查复投（依赖目标返利）
    if (extractedReturn >= target) {
      const reinvestTimes = Math.floor(extractedReturn / target);
      capital += reinvestTimes * target * leverage; // 复投增加资本
      extractedReturn -= reinvestTimes * target; // 扣除复投金额
      reinvests += reinvestTimes;
    }

    days++;
    labels.push(days);
    capitalData.push(capital.toFixed(2));
  }

  // 格式化输出
  output.classList.remove("error");
  output.innerText = 
    `回本所需天数（累计收益达到 $${initial.toFixed(2)}）：${firstBreakEvenDays || days} 天\n` +
    `达到每日返利 $${target.toFixed(2)} 需要 ${days} 天\n` +
    `共复投 ${reinvests} 次\n` +
    `最终资本：$${capital.toFixed(2)}`;

  // 销毁旧图表实例
  const ctx = document.getElementById('capitalChart').getContext('2d');
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  // 绘制新图表
  window.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '资本 ($)',
        data: capitalData,
        borderColor: '#00cc66',
        backgroundColor: 'rgba(0, 204, 102, 0.2)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: '天数' } },
        y: { title: { display: true, text: '资本 ($)' } }
      }
    }
  });
}