openapi: 3.1.0
info:
  title: Api
  version: 0.1.0
  description: API specification
servers:
  - url: /api
    description: Base API path
tags:
  - name: health
    description: Health operations
  - name: survey
    description: Survey operations
paths:
  /healthz:
    get:
      operationId: healthCheck
      tags: [health]
      summary: Health check
      description: Returns server health status
      responses:
        "200":
          description: Healthy
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/HealthStatus"
  /survey:
    post:
      operationId: submitSurvey
      tags: [survey]
      summary: Submit survey response
      description: Save a survey response
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/SurveySubmission"
      responses:
        "201":
          description: Survey saved
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SurveyResponse"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
components:
  schemas:
    HealthStatus:
      type: object
      properties:
        status:
          type: string
      required:
        - status
    SurveySubmission:
      type: object
      properties:
        mostImportantWord:
          type: string
        mostImportantArea:
          type: string
          enum: [Family, Friends, School, Career, Health, Money, Personal Growth, Faith]
        careerImportance:
          type: string
          enum: [Very important, Somewhat, Neutral, Slightly, Not important]
        meaningfulThings:
          type: array
          items:
            type: string
        otherMeaningfulThing:
          type: ["string", "null"]
        whyItMatters:
          type: string
      required:
        - mostImportantWord
        - mostImportantArea
        - careerImportance
        - meaningfulThings
        - whyItMatters
    SurveyResponse:
      type: object
      properties:
        id:
          type: integer
        mostImportantWord:
          type: string
        mostImportantArea:
          type: string
        careerImportance:
          type: string
        meaningfulThings:
          type: array
          items:
            type: string
        otherMeaningfulThing:
          type: ["string", "null"]
        whyItMatters:
          type: string
        createdAt:
          type: string
          format: date-time
      required:
        - id
        - mostImportantWord
        - mostImportantArea
        - careerImportance
        - meaningfulThings
        - whyItMatters
        - createdAt
    ErrorResponse:
      type: object
      properties:
        error:
          type: string
      required:
        - error
