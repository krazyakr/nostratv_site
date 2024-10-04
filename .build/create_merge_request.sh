#!/usr/bin/env bash

# TARGET_BRANCH=staging

# Gitlab Server host API
CI_PROJECT_URL="https://rmtorres.no-ip.info/api/v4/projects/"

BODY="{
    \"id\": ${CI_PROJECT_ID},
    \"source_branch\": \"${SOURCE_BRANCH}\",
    \"target_branch\": \"${TARGET_BRANCH}\",
    \"remove_source_branch\": false,
    \"title\": \"${CI_COMMIT_TAG}\",
    \"assignee_id\":\"${GITLAB_USER_ID}\"
}";

echo "Opening a new merge request: ${CI_COMMIT_TAG} on ${CI_PROJECT_URL}${CI_PROJECT_ID} and assigned to ${GITLAB_USER_NAME}";

curl -X POST "${CI_PROJECT_URL}${CI_PROJECT_ID}/merge_requests" \
    --header "PRIVATE-TOKEN:${AUTH_TOKEN}" \
    --header "Content-Type: application/json" \
    --data "${BODY}";

exit;
