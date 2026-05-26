// База вопросов
const questionsDatabase = {
    server: [
        {
            id: 1,
            type: "multiple",
            question: "Что такое DM (DeathMatch) согласно правилам сервера?",
            options: ["Убийство без IC-причины", "NonRP вождение", "Уход в AFK", "Нарушение chat"],
            correct: 0,
            ruleNumber: "2.19",
            ruleFull: "Запрещён DM (DeathMatch) — убийство без веской IC-причины — | Jail 90 минут",
            punishment: "Jail 90 минут",
            hint: "Это убийство без причины"
        }
    ],
    admin: [
        {
            id: 101,
            type: "multiple",
            question: "Какова основная обязанность администратора?",
            options: ["Контроль процесса", "Заработок денег", "Развлечение", "Скупка имущества"],
            correct: 0,
            ruleNumber: "1.02",
            ruleFull: "В обязанности администратора входит: Контроль всего ролевого игрового процесса",
            punishment: "N/A",
            hint: "Это контроль сервера"
        }
    ],
    rp: [
        {
            id: 201,
            type: "multiple",
            question: "Что означает DM (DeathMatch)?",
            options: ["Убийство без причины", "Быстрая езда", "Читы", "AFK режим"],
            correct: 0,
            ruleNumber: "РП Термин 1",
            ruleFull: "DM - Убийство без причины",
            punishment: "Jail 90 минут",
            hint: "Death Match"
        }
    ]
};

function getQuestions(category = 'all') {
    if (category === 'all') {
        return [...questionsDatabase.server, ...questionsDatabase.admin, ...questionsDatabase.rp];
    }
    return questionsDatabase[category] || [];
}