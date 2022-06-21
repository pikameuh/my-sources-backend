
export const Error = { 
    JWT_OUT_DATED:                  {code: 0, name: "JWT_OUT_DATED", message: 'Token seems outdated..' },
    INVALID_CREDENTIALS:            {code: 1, name: "INVALID_CREDENTIALS", message: 'Credentials match no entry in database..' },
    USER_UNACTIVATED:               {code: 2, name: "USER_UNACTIVATED", message: 'User is not allowed inside..' },
    NOT_ENOUGHT_RIGHT_FOR_ACTION:   {code: 3, name: "NOT_ENOUGHT_RIGHT_FOR_ACTION", message: 'Insuffisient rights for this action'},
    BRUT_FORCE:                     {code: 4, name: "BRUT_FORCE", message: 'Potential brut force attack detected'}
}