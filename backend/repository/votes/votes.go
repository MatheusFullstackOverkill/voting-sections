package votes_repo

import (
	config "backend/init"
	"backend/interfaces"
)

func CreateVote(data *interfaces.Vote) interfaces.Vote {
	var vote interfaces.Vote

	config.DB.Statement.Raw(`
		INSERT INTO vote
		(
			user_id,
			topic_id,
			approved
		) VALUES (
			$1,
			$2,
			$3
		) RETURNING	*
	`,
		data.UserID,
		data.TopicID,
		data.Approved,
	).Scan(&vote)

	return vote
}

func ListVotesByTopic(topicId int) []interfaces.Vote {
	var votes = []interfaces.Vote{}

	config.DB.Statement.Raw(`
		SELECT
			*
		FROM vote WHERE topic_id = $1 ORDER BY created_at DESC
	`,
		topicId).Scan(&votes)

	return votes
}

func CountVotesByTopic(topicId int) []interfaces.Vote {
	var votes = []interfaces.Vote{}

	config.DB.Statement.Raw(`
		SELECT * FROM vote WHERE topic_id = $1 ORDER BY created_at DESC
	`,
		topicId).Scan(&votes)

	return votes
}
