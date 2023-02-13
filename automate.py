import subprocess
import os
from re import sub
def camel_case(s):
      s = sub(r"(_|-)+", " ", s).title().replace(" ", "")
      return ''.join([s[0].lower(), s[1:]])


def get_envvars(env_file='auto-config.env', set_environ=True, ignore_not_found_error=False, exclude_override=()):
    """
    Set env vars from a file
    :param env_file:
    :param set_environ:
    :param ignore_not_found_error: ignore not found error
    :param exclude_override: if parameter found in this list, don't overwrite environment
    :return: list of tuples, env vars
    """
    env_vars = []
    try:

        with open(env_file) as f:
            for line in f:
                line = line.replace('\n', '')

                if not line or line.startswith('#'):
                    continue

                # Remove leading `export `
                if line.lower().startswith('export '):
                    key, value = line.replace('export ', '', 1).strip().split('=', 1)
                else:
                    try:
                        key, value = line.strip().split('=', 1)
                    except ValueError:
                        logging.error(f"envar_utils.get_envvars error parsing line: '{line}'")
                        raise

                
                    
                    if(key=='NOME_CSA'):
                        os.environ["NOME_CSA_STRIPED"] = value.replace(" ","").lower()
                    
                    os.environ[key] = value
               
    except FileNotFoundError:
        if not ignore_not_found_error:
            raise

    return env_vars

print(get_envvars())
subprocess.run(['C:\\cygwin64\\bin\\bash.exe', '-l', 'automate-script.sh'],cwd='C:\\Users\\andre\\Documents\\amigo\\api\\')
