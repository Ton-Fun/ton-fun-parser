export default {
    /**
     * Address of game contract
     */
    address: 'EQBfpjXuUSvL8q64Bg0qJHFXro1gt81LFDjNJw9ZWibC8UZK',

    /**
     * Examples:
     *     'https://toncenter.com/api/v2/jsonRPC'
     *     'https://mainnet.tonhubapi.com/jsonRPC'
     *     'https://api.tonhold.com/jsonRPC'
     *     'https://api.uniton.app/jsonRPC'
     */
    endpoint: 'https://api.uniton.app/jsonRPC',

    /**
     * Maximum transactions per call
     */
    limit: 50,

    /**
     * Delay between calls in milliseconds
     */
    delay: 500,

    log: {
        /**
         * Path to log file
         */
        all: 'log/parser.log',

        /**
         * Path to error only log file
         */
        error: 'log/error.log',

        /**
         * Max log file size in bytes
         */
        maxSize: 10 * 1024 * 1024 // 10 MB
    }
}