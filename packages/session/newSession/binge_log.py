import requests
from dotenv import load_dotenv
from os import environ
from json import dumps as json_dumps

# Load environment variables
load_dotenv()

class StreamToLogger:
    """
    Fake file-like stream object that redirects writes to a logger instance.
    """
    def __init__(self, logger, level="info"):
        self.logger = logger
        self.level = level

    def write(self, message):
        """
        Write the message to the logger.
        """
        if self.level == "info":
            self.logger.info(message)
        elif self.level == "error":
            self.logger.error(message)
        # Add more levels if needed

    def flush(self):
        """
        Flush the stream - for compatibility with file objects.
        """
        pass

class Logger:
    def __init__(self, function_name, default_log_level='DEBUG'):
        self.secret_key = environ.get("SUPABASE_KEY")
        self.default_log_level = default_log_level
        base_url = environ.get("LOGGING_URL", "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-08e1e9bb-6c28-49dc-ab50-0b63fac3c390/")
        self.url = f"{base_url}auth/log"
        self.headers = {"Content-Type": "application/json"}
        self.function_name = function_name

    def error(self, message, function_name=None, given_args=None):
        function_name = function_name if function_name else self.function_name
        return self._log(function_name, message, given_args, 'ERROR')

    def warning(self, message, function_name=None, given_args=None):
        function_name = function_name if function_name else self.function_name
        return self._log(function_name, message, given_args, 'WARNING')

    def info(self, message, function_name=None, given_args=None):
        function_name = function_name if function_name else self.function_name
        return self._log(function_name, message, given_args, 'INFO')

    def debug(self, message, function_name=None, given_args=None):
        function_name = function_name if function_name else self.function_name
        return self._log(function_name, message, given_args, 'DEBUG')

    def _log(self, function_name, message, given_args=None, level=None):
        log_level = level if level else self.default_log_level

        try:
            json_dumps(given_args)
        except TypeError:
            # make it serializable as a string representation
            given_args = str(given_args)

        args = {
            'access_token': self.secret_key,
            'function_name': function_name,
            'given_args': given_args,
            'message': message,
            'level': log_level
        }
        response = requests.get(self.url, json=args, headers=self.headers)
        return response.text

# Example usage
if __name__ == '__main__':
    secret_key = environ.get("SUPABASE_KEY")
    logger = Logger(__name__)
    args = {
        'access_token': environ.get("SUPABASE_KEY"),
        'function_name': 'test_function',
        'given_args': {'arg1': 'value1', 'arg2': 'value2'},
        'message': 'Test log message',
        'level': 'INFO'
    }
    # Example log
    response = logger.warning('Testing Logger object', given_args=args['given_args'])
    print(response)
