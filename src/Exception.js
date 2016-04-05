class Exception {
  constructor(reason) {
    this._reason = reason;
  }

  toString() {
    return this._reason;
  }
}

export default Exception;