export const GET_CURRENT_USER_QUERY = `
  query GetCurrentUser {
    me {
      id
      username
      fullName
      phone
      avatarUrl
      createdAt
      notificationEnabled
      targetExam
      lastActiveAt
      userStats {
        id
        userId
        level
        totalXp
        currentStreak
        lastActivityDate
        overallAccuracy
        totalCorrectAnswers
        totalPracticeTimeMinutes
        totalQuestionsAttempted
        totalQuizzesCompleted
        updatedAt
        xpToNextLevel
      }
    }
  }
`;
