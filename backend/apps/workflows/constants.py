VALID_TASK_CONNECTIONS = {
    'scraping': {
        'valid_targets': ['summarization', 'email'],
        'output_mapping': {
            'summarization': 'input_text',
            'email': 'body'
        }
    },
    'classification': {
        'valid_targets': ['email'],
        'output_mapping': {
            'email': 'body'
        }
    },
    'summarization': {
        'valid_targets': ['email'],
        'output_mapping': {
            'email': 'body'
        }
    },
    'email': {
        'valid_targets': [],
        'output_mapping': {}
    }
}
