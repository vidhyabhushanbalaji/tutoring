import { tutoringType } from './tutoringType'
import { partialLessonType } from './partialLessonType'
import { personType } from './personType'

export interface parentHomeType {
    tutors: tutoringType[], 
    unpaid: partialLessonType[],
    next3: partialLessonType[],
    first_name: string, 
    last_name: string,
    email: string, 
   parent: {first_name: string,
            last_name: string,
            email: string,
            authcode: string
    },
    tutor: personType,
}