# utils.py

import requests
from bs4 import BeautifulSoup
from slugify import slugify
from pprint import pprint
from rest_framework.response import Response
from rest_framework import status

def format_content(content):
    """Use BeautifulSoup to remove HTML tags and convert it to plain text."""
    soup = BeautifulSoup(content, 'html.parser')
    return soup.get_text(separator='\n').strip()

def format_example_testcases(example_testcases):
    """Format example test cases into input/output pairs."""
    lines = example_testcases.strip().split('\n')
    formatted_cases = []
    for i in range(0, len(lines), 2):
        if i + 1 < len(lines):
            formatted_cases.append(f"Input: {lines[i]}\nOutput: {lines[i + 1]}\n")
    return "\n".join(formatted_cases)

def get_leetcode_question_details(title):
    """Fetch the details of a LeetCode question by title."""
    title_slug = slugify(title)
    url = 'https://leetcode.com/graphql'
    query = f'''
    {{
      question(titleSlug: "{title_slug}") {{
        title
        titleSlug
        content
        difficulty
        exampleTestcases
      }}
    }}
    '''
    
    headers = {
        'Content-Type': 'application/json',
    }

    response = requests.post(url, json={'query': query}, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        question = data['data']['question']
        
        if question:
            title = question['title']
            difficulty = question['difficulty']
            content = format_content(question['content'])
            example_testcases = question['exampleTestcases']

            # Format example test cases with expected outputs
            formatted_testcases = format_example_testcases(example_testcases)

            return {
                'title': title,
                'difficulty': difficulty,
                'content': content,
                'example_testcases': formatted_testcases
            }
        else:
            return None
    else:
        return None
#decorator to check if user has 10 tokens
def check_ai_tokens(required_tokens):
    def decorator(func):
        def wrapper(view, request, *args, **kwargs):
            user = request.user
            if not user.subscription_status and user.ai_tokens < required_tokens:
                return Response(
                    {"error": "Not enough AI tokens."},
                    status=status.HTTP_402_PAYMENT_REQUIRED
                )
            return func(view, request, *args, **kwargs)
        return wrapper
    return decorator

if __name__ == "__main__":
    output = get_leetcode_question_details("Replace All Digits with Characters")
    pprint(output)
    print("----------------------question-------------------------")
    pprint(output['title'])
    print("--------------------difficulty--------------------")
    pprint(output['difficulty'])
    print("--------------------description--------------------")
    pprint(output['content'])
    print("--------------------example_testcases--------------------")
    pprint(output['example_testcases'])