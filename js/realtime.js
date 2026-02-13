(() => {
    dayjs.extend(window.dayjs_plugin_duration)
    const el = document.getElementById('realtime_duration')
    // 改成自己的时间
    const date = dayjs('2018-01-10')
  
    setInterval(() => {
      const now = dayjs()
      const startDate = dayjs('2018-01-10')
      
      // 计算年、月、日、时、分、秒
      const years = now.diff(startDate, 'year')
      const months = now.diff(startDate.add(years, 'year'), 'month')
      const days = now.diff(startDate.add(years, 'year').add(months, 'month'), 'day')
      const hours = now.diff(startDate.add(years, 'year').add(months, 'month').add(days, 'day'), 'hour')
      const minutes = now.diff(startDate.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour'), 'minute')
      const seconds = now.diff(startDate.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour').add(minutes, 'minute'), 'second')
      
      // 显示完整格式
      el.innerHTML = `本站已运行 ${years}年 ${months}月 ${days}天 ${hours}时 ${minutes}分 ${seconds}秒`
    }, 1000)
  })()