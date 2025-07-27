function calculate() {
  let initial = parseFloat(document.getElementById("initial").value);
  let rate = parseFloat(document.getElementById("rate").value);
  let leverage = parseFloat(document.getElementById("leverage").value);
  let capital = initial * leverage;
  let dailyReturn = capital * rate;
  let totalReturn = 0;
  let days = 0;
  let reinvests = 0;

  while (dailyReturn < 100) {
    let todayReturn = capital * rate;
    totalReturn += todayReturn;
    capital -= todayReturn;
    if (totalReturn >= 100) {
      let reinvestTimes = Math.floor(totalReturn / 100);
      capital += reinvestTimes * 100 * leverage;
      reinvests += reinvestTimes;
      totalReturn -= reinvestTimes * 100;
    }
    dailyReturn = capital * rate;
    days++;
  }

  document.getElementById("output").innerText =
    `达到每日返还 $100 需要 ${days} 天，共复投 ${reinvests} 次。`;
}
