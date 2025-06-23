package topics

import (
	app "backend/init"
	"backend/interfaces"
	topic_repo "backend/repository/topics"
	vote_repo "backend/repository/votes"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateTopic(c *fiber.Ctx) error {
	topicRequest := new(interfaces.Topic)

	if err := c.BodyParser(topicRequest); err != nil {
		return err
	}

	topicRequest.CreatorID = app.RequestUser.UserID

	topic := topic_repo.CreateTopic(topicRequest)

	return c.Status(201).JSON(topic)
}

func UpdateTopic(c *fiber.Ctx) error {
	topicId, _ := strconv.Atoi(c.Params("topic_id"))

	topicRequest := new(interfaces.Topic)

	err := c.BodyParser(topicRequest)

	if err != nil {
		return err
	}

	currentTopic := topic_repo.RetrieveTopicByID(topicId)
	if currentTopic.TopicID == 0 {
		return c.Status(400).JSON(map[string]string{"error": "topic not found"})
	}

	topicRequest.TopicID = topicId
	loc, _ := time.LoadLocation("America/Sao_Paulo")
	currentTime := time.Now().In(loc).UTC()

	topicRequest.SessionStartedAt = &currentTime

	topic := topic_repo.UpdateTopic(topicRequest)

	return c.JSON(topic)
}

func RetriveTopic(c *fiber.Ctx) error {
	topicId, _ := strconv.Atoi(c.Params("topic_id"))

	topic := topic_repo.RetrieveTopicByID(topicId)

	if topic.TopicID == 0 {
		return c.Status(400).JSON(map[string]string{"error": "topic not found"})
	}

	status := "not_started"

	if topic.SessionStartedAt != nil {
		loc, _ := time.LoadLocation("America/Sao_Paulo")
		currentTime := time.Now().In(loc).UTC()

		sessionClosingTime := topic.SessionStartedAt.Add(time.Minute * time.Duration(*topic.DurationMinutes)).In(loc).UTC()

		if currentTime.After(sessionClosingTime) {
			status = "finished"
		} else {
			status = "started"
		}
	}

	topic.Status = status

	return c.JSON(topic)
}

func ListTopics(c *fiber.Ctx) error {
	params := interfaces.ListParams{}

	err := c.QueryParser(&params)

	if err != nil {
		return err
	}

	topics := topic_repo.ListTopics(&params)
	total := topic_repo.RetrieveTopicsTotal()

	for i, topic := range topics {
		status := "not_started"

		if topic.SessionStartedAt != nil {
			loc, _ := time.LoadLocation("America/Sao_Paulo")
			currentTime := time.Now().In(loc).UTC()

			sessionClosingTime := topic.SessionStartedAt.Add(time.Minute * time.Duration(*topic.DurationMinutes)).In(loc).UTC()

			if currentTime.After(sessionClosingTime) {
				status = "finished"
			} else {
				status = "started"
			}
		}

		topics[i].Status = status
	}

	return c.JSON(interfaces.ListResult[interfaces.Topic]{Data: topics, Count: total})
}

func CreateTopicVote(c *fiber.Ctx) error {
	topicId, _ := strconv.Atoi(c.Params("topic_id"))
	voteRequest := new(interfaces.Vote)

	topic := topic_repo.RetrieveTopicByID(topicId)

	if topic.TopicID == 0 {
		return c.Status(400).JSON(map[string]string{"error": "topic not found"})
	}

	if err := c.BodyParser(voteRequest); err != nil {
		return err
	}

	if topic.SessionStartedAt == nil {
		return c.Status(400).JSON(map[string]string{"error": "topic session not started yet"})
	}

	loc, _ := time.LoadLocation("America/Sao_Paulo")
	currentTime := time.Now().In(loc).UTC()

	sessionClosingTime := topic.SessionStartedAt.Add(time.Minute * time.Duration(*topic.DurationMinutes)).In(loc).UTC()

	if currentTime.After(sessionClosingTime) {
		return c.Status(400).JSON(map[string]string{"error": "topic session already closed"})
	}

	voteRequest.TopicID = topicId
	voteRequest.UserID = app.RequestUser.UserID

	vote := vote_repo.CreateVote(voteRequest)

	return c.Status(201).JSON(vote)
}

func RetriveTopicResults(c *fiber.Ctx) error {
	topicId, _ := strconv.Atoi(c.Params("topic_id"))

	topic := topic_repo.RetrieveTopicByID(topicId)

	if topic.TopicID == 0 {
		return c.Status(400).JSON(map[string]string{"error": "topic not found"})
	}

	votes := vote_repo.ListVotesByTopic(topicId)

	approved_count := 0
	repproved_count := 0

	for _, v := range votes {
		if v.Approved {
			approved_count += 1
		} else {
			repproved_count += 1
		}
	}

	result := "tied"

	if approved_count > repproved_count {
		result = "approved"
	}

	if approved_count < repproved_count {
		result = "repproved"
	}

	return c.JSON(interfaces.TopicResults{Result: result, ApprovedCount: approved_count, RepprovedCount: repproved_count})
}
