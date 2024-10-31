module.exports = (comments) => {
  const commentTreeMap = {};

  // Создаем карту комментариев с инициализацией поля replyCount
  comments.forEach((comment) => {
    commentTreeMap[comment.id] = {
      ...comment,
      replies: [],
      replyCount: 0,
    };
  });

  // Функция для подсчета вложенных ответов
  const countReplies = (comment) => {
    let totalReplies = 0;

    comment.replies.forEach((reply) => {
      totalReplies += 1 + countReplies(reply);
    });

    return totalReplies;
  };

  const commentTree = [];

  // Строим дерево комментариев и считаем ответы
  comments.forEach((comment) => {
    if (comment.commentId) {
      if (commentTreeMap[comment.commentId]) {
        commentTreeMap[comment.commentId].replies.push(
          commentTreeMap[comment.id],
        );
      }
    } else {
      commentTree.push(commentTreeMap[comment.id]);
    }
  });

  // Подсчитываем количество ответов только для родительских комментариев
  commentTree.forEach((comment) => {
    comment.replyCount = countReplies(comment);
  });

  return commentTree;
};
