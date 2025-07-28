function calculate() {
  const initial = parseFloat(document.getElementById("initial").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const leverage = parseFloat(document.getElementById("leverage").value);
  const target = parseFloat(document.getElementById("target").value);
  const output = document.getElementById("output");
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
  let capital = initial * leverage;
  let totalReturn = 0;
  let days = 0;
  let reinvests = 0;
  let firstTargetDays = null;
  const capitalData = [capital.toFixed(2)];
  const labels = [0];
  while (capital * rate < target) {
    if (days > 10000) {
      output.innerText = "错误：计算时间过长，可能无法达到目标！";
      output.classList.add("error");
      return;
    }
    const dailyReturn = capital * rate;
    totalReturn += dailyReturn;
    capital -= dailyReturn;
    if (firstTargetDays === null && totalReturn >= target) {
      firstTargetDays = days + 1;
    }
    if (totalReturn >= target) {
      const reinvestTimes = Math.floor(totalReturn / target);
      capital += reinvestTimes * target * leverage;
      totalReturn -= reinvestTimes * target;
      reinvests += reinvestTimes;
    }
    days++;
    labels.push(days);
    capitalData.push(capital.toFixed(2));
  }
  output.classList.remove("error");
  output.innerText = 
    `首次达到每日返利 $${target.toFixed(2)} 需要 ${firstTargetDays || days} 天\n` +
    `达到每日返利 $${target.toFixed(2)} 需要 ${days} 天\n` +
    `共复投 ${reinvests} 次\n` +
    `最终资本：$${capital.toFixed(2)}\n` +
    `累计收益：$${totalReturn.toFixed(2)}`;
  const ctx = document.getElementById('capitalChart').getContext('2d');
  new Chart(ctx, {
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