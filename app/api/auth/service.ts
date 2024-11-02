import User      from "@/app/models/User"
import dbConnect from "@/lib/dbConnect"

export default class AuthService {
//   async getAuthInfo(
//     filter: Partial<Pick<IUser, '_id' | 'email'>>,
//     // options: { password: boolean } = { password: false }
//   ): Promise<IUser | null> {
//     await dbConnect()
    
  //     if (!filter?._id && !filter?.email) {
  //       return null
  //     }
    
  //     if (filter?._id) {
  //       delete filter.email
  //     }
    
    
  //     const user = await User
  //       .findOne(filter)
  //     //   .select(fields)
  //     //   .populate({
  //     //     path:   'permissions',
  //     //     select: GET_PROFILE_OPTIONS.POPULATE.select
  //     //   })
  //     //   .populate({
  //     //     path:   'parent',
  //     //     select: 'role firstName lastName'
  //     //   })
  //     //   .lean(GET_PROFILE_OPTIONS.LEAN)
    
  //     if (!user) {
  //       return null
  //     }
    
  //     return user
  //   }

  async signInWithGoogle(googleProfile) {
    await dbConnect()

    console.log({googleProfile})
    const { email, name: username } = googleProfile

    let user = await User.findOne({ email })

    if (user) {
      return user
    }
    const newUser = {
      email,
      username,
    }

    user = await User.create(newUser)


    return user
  }
}