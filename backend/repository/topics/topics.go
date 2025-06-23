package topics_repo

import (
	config "backend/init"
	"backend/interfaces"
	"fmt"
)

func CreateTopic(data *interfaces.Topic) interfaces.Topic {
	var topic interfaces.Topic

	config.DB.Statement.Raw(`
		INSERT INTO topic
		(
			creator_id,
			title,
			description
		) VALUES (
			$1,
			$2,
			$3
		) RETURNING *
	`,
		data.CreatorID,
		data.Title,
		data.Description,
	).Scan(&topic)

	return topic
}

func UpdateTopic(data *interfaces.Topic) interfaces.Topic {
	var topic interfaces.Topic

	config.DB.Statement.Raw(`
		UPDATE topic SET
			session_started_at=$1,
			duration_minutes=$2
		WHERE topic_id = $3
		RETURNING *
	`,
		data.SessionStartedAt,
		data.DurationMinutes,
		data.TopicID).Scan(&topic)

	return topic
}

func RetrieveTopicByID(topicId int) interfaces.Topic {
	var topic interfaces.Topic

	config.DB.Statement.Raw(`
		SELECT
			*
		FROM topic
		WHERE topic_id = $1
	`, topicId).Scan(&topic)

	return topic
}

func ListTopics(listParams *interfaces.ListParams) []interfaces.Topic {
	topics := make([]interfaces.Topic, 0)

	if listParams.Limit == 0 {
		listParams.Limit = 10
	}

	query := `
		SELECT 
			*
		FROM topic
		ORDER BY created_at DESC
		OFFSET @Offset
		LIMIT @Limit
	`

	config.DB.Raw(query, listParams).Scan(&topics)

	fmt.Println(topics)

	return topics
}

func RetrieveTopicsTotal() int {
	topics := new([]interfaces.Topic)

	query := `
		SELECT 
			topic_id
		FROM topic
	`

	config.DB.Raw(query).Scan(&topics)

	return len(*topics)
}
