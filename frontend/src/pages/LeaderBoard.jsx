import React from 'react'
import Card from '../Components/Card'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { FirstPlaceSvg, SecondPlaceSvg, ThirdPlaceSvg, LeaderboardExplanationSvg,LeaderboardBannerSvg } from '../Components/Svgs'
import { motion } from 'framer-motion'

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = React.useState([])
  const { access } = useSelector((state) => state.auth)

  React.useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/streaks/leaderboard/`, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    })
      .then(response => {
        setLeaderboard(response.data)
      })
  }, [access])

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const articleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  }

  return (
    <>
      <Card>
        <h1 className="text-3xl font-bold text-gray-700">Leaderboard</h1>
        
        <motion.div variants={containerVariants} className='flex items-center justify-center'>

        <LeaderboardBannerSvg/>
        </motion.div>
        

        {/* Animated explanation article */}
        <motion.article 
          className="relative mx-auto mt-6 h-fit shrink-0 gap-5 rounded-2xl border-2 border-gray-200 p-6 xl:flex"
          variants={articleVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-5">
            <h2 className="font-bold uppercase text-gray-400">
              What are leaderboards?
            </h2>
            <p className="font-bold text-gray-700">
              Do lessons. Earn XP. Compete with your Friends.
            </p>
            <p className="text-gray-400 px-5">
              Earn XP through completing your daily tasks, and compete with your friends to see who can earn the most XP.
            </p>
          </div>
          <div className="w-10 shrink-0"></div>
          <LeaderboardExplanationSvg />
        </motion.article>

        {/* Animated leaderboard entries */}
        <div className="flex w-full max-w-xl flex-col items-center gap-5 pb-28 md:px-5 mx-auto mt-6">
          <motion.div 
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.user_id}
                className="flex items-center gap-5 rounded-2xl px-5 py-2 hover:bg-gray-100 transition-transform transform hover:scale-105"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                {index === 0 ? (
                  <FirstPlaceSvg />
                ) : index === 1 ? (
                  <SecondPlaceSvg />
                ) : index === 2 ? (
                  <ThirdPlaceSvg />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center font-bold text-green-700">
                    {index + 1}
                  </div>
                )}
                <img
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                  src={`${user.profile_picture}`}
                  alt={`${user.username}'s profile picture`}
                />
                <div className="grow overflow-hidden overflow-ellipsis font-bold">
                  {user.username}
                </div>
                <div className="shrink-0 text-gray-500">{`${user.experience_points} XP`}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Card>
    </>
  )
}

export default LeaderBoard
