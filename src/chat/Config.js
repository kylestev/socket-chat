import * as _ from 'lodash'

/**
 * Handles loading and retrieving of JSON configuration files.
 */
class Config {
  /**
   * Creates a new {@link Config} instance
   * @param  {String} path path to JSON or JS config file
   */
  constructor(path) {
    this.data = require(path)
  }

  /**
   * Retrieves a config child from the loaded config given a path to the child.
   * @param  {String|null} path the nested path to a child. null results in
   * the entire config object being returned.
   * @param  {null|mixed} defaultValue value to return if the path does not
   * resolve to a child in the underlying {@code Object}
   * @return {mixed} item at the {@code path} provided, or the
   * {@code defaultValue} provided if the {@code path} does not exist
   */
  get(path, defaultValue = null) {
    return ! path ? this.data : _.get(this.data, path, defaultValue)
  }
}

export { Config }
