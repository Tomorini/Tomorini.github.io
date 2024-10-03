// anniversary.js

function initializeAnniversary() {
    function LunarDate(Year, Month, Day) {
        try {
            let solar = Lunar.fromYmdHms(Year, Month, Day, 0, 0, 0).getSolar();
            return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
        } catch (error) {
            return LunarDate(Year, Month, Day - 1);
        }
    }
    // 璁＄畻涓や釜鏃ユ湡涔嬮棿鐨勫ぉ鏁板樊
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.floor((date2 - date1) / oneDay);
    }
    // 璁＄畻涓や釜鏃ユ湡涔嬮棿鐨勫懆鏁板拰澶╂暟宸�
    function weeksAndDaysBetween(date1, date2) {
        const totalDays = daysBetween(date1, date2);
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        return { weeks, days };
    }
    // 璁＄畻涓や釜鏃ユ湡涔嬮棿鐨勬湀鏁板拰澶╂暟宸�
    function monthsAndDaysBetween(date1, date2) {
        let years = date2.getFullYear() - date1.getFullYear();
        let months = date2.getMonth() - date1.getMonth() + years * 12;
        let days = date2.getDate() - date1.getDate();

        if (days < 0) {
            months -= 1;
            let previousMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
            days += previousMonth.getDate();
        }

        return { months, days };
    }
    // 鍓╀綑澶╂暟
    function daysLeft(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        return daysBetween(now, anniversaryDate);
    }
    // 缁忚繃澶╂暟
    function totalDays(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate;
        if (isLunar) {
            startDate = LunarDate(Year, Month, Day);
        } else {
            startDate = new Date(Year, Month - 1, Day);
        }
        return daysBetween(startDate, now);
    }
    // 杩斿洖鐩爣鎴栬捣濮嬫棩鏈熶互鍙婃槦鏈熷嚑
    function targetDate(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        // 鑾峰彇鏄熸湡鍑�
        const weekDay = anniversaryDate.toLocaleDateString('zh-CN', { weekday: 'long' });
        // 杩斿洖骞存湀鏃ュ姞鏄熸湡鍑�
        const year = anniversaryDate.getFullYear();
        const month = (anniversaryDate.getMonth() + 1).toString().padStart(2, '0'); // 鏈堜唤浠�0寮€濮嬶紝闇€瑕佸姞1
        const day = anniversaryDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day} (${weekDay})`; // 浣跨敤'-'浣滀负鍒嗛殧绗�
        //   return anniversaryDate.toDateString();  // 鐩存帴杩斿洖鏂滄潌鏃ユ湡
        // return anniversaryDate.toLocaleDateString('zh-CN');
    }
    // 杩斿洖鐩爣鎴栬捣濮嬫棩鏈燂紙鏍规嵁 displayMode锛�
    function targetOrStartDate(dateStr, isLunar, displayMode) {
        if (displayMode === "elapsed") {
            return dateStr; // 濡傛灉鏄痚lapsed妯″紡锛岀洿鎺ヨ繑鍥為厤缃殑鏃ユ湡锛堣捣濮嬫棩锛�
        } else {
            return targetDate(dateStr, isLunar); // 鍚﹀垯锛屾樉绀虹洰鏍囨棩鏈熷拰鏄熸湡鍑�
        }
    }

    const countdownElements = document.querySelectorAll(".countdown");
    // const totalDaysElements = document.querySelectorAll(".total-days");
    // const targetDateElements = document.querySelectorAll(".target-date");

    countdownElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 鑾峰彇 display_mode
        // let daysText;
        if (displayMode === "elapsed") {
            // 鍒濆鍖栨樉绀虹姸鎬佷负0锛堝ぉ鏁帮級
            elem.dataset.displayState = '0';
            // 鏇存柊鏄剧ず
            updateElapsedDisplay(elem, dateStr, isLunar, 0);
            // 娣诲姞鐐瑰嚮浜嬩欢鐩戝惉鍣�
            elem.addEventListener('click', function () {
                let currentState = parseInt(elem.dataset.displayState);
                currentState = (currentState + 1) % 3; // 鍦�0銆�1銆�2涔嬮棿寰幆
                elem.dataset.displayState = currentState.toString();
                updateElapsedDisplay(elem, dateStr, isLunar, currentState);
            });
        } else {
            // 鏄剧ず鍓╀綑澶╂暟
            let daysText = daysLeft(dateStr, isLunar);
            elem.textContent = daysText;
            elem.nextElementSibling.textContent = "澶╁悗"; // 鏄剧ず鈥滃ぉ鍚庘€�
        }
    });

    // 鏇存柊elapsed妯″紡涓嬬殑鏄剧ず鍐呭
    function updateElapsedDisplay(elem, dateStr, isLunar, displayState) {
        if (displayState === 0) {
            // 鏄剧ず宸茬粡杩囧幓鐨勫ぉ鏁�
            let days = totalDays(dateStr, isLunar);
            elem.textContent = days;
            elem.nextElementSibling.textContent = "澶╀簡";
        } else if (displayState === 1) {
            // 鏄剧ず宸茬粡杩囧幓鐨勫懆鏁板拰澶╂暟
            const [Year, Month, Day] = dateStr.split("-").map(Number);
            let now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let startDate;
            if (isLunar) {
                startDate = LunarDate(Year, Month, Day);
            } else {
                startDate = new Date(Year, Month - 1, Day);
            }

            let { weeks, days } = weeksAndDaysBetween(startDate, now);
            if (days === 0) {
                elem.textContent = weeks;
                elem.nextElementSibling.textContent = "鍛ㄤ簡";
            } else {
                elem.textContent = `${weeks}鍛�${days}澶ー;
                elem.nextElementSibling.textContent = "浜�";
            }
        } else if (displayState === 2) {
            // 鏄剧ず宸茬粡杩囧幓鐨勬湀鏁板拰澶╂暟
            const [Year, Month, Day] = dateStr.split("-").map(Number);
            let now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let startDate;
            if (isLunar) {
                startDate = LunarDate(Year, Month, Day);
            } else {
                startDate = new Date(Year, Month - 1, Day);
            }

            let { months, days } = monthsAndDaysBetween(startDate, now);
            elem.textContent = `${months}鏈�${days}澶ー;
            elem.nextElementSibling.textContent = "浜�";
        }
    }

    // 鏄剧ず鐩爣鎴栬捣濮嬫棩鏈�
    const targetDateElements = document.querySelectorAll(".target-date");
    targetDateElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 鑾峰彇 display_mode
        elem.textContent = targetOrStartDate(dateStr, isLunar, displayMode);
    });
}

// 鍒濆椤甸潰鍔犺浇
document.addEventListener("DOMContentLoaded", initializeAnniversary);

// 閫傞厤 pjax
document.addEventListener("pjax:complete", initializeAnniversary);