import { Checkbox } from '@nextui-org/react';

const DailyTasks = ({ dailyTasks }) => {
  // Ensure dailyTasks is an array or set it to an empty array if not
  const tasksArray = Array.isArray(dailyTasks) ? dailyTasks : [dailyTasks];
  const allTaskComplete = tasksArray.every((t) => t.leetcodeTask && t.aiInterviewTask && t.aiQuizTask)


  return (
    <div>
      <h3 className='text-center text-2xl'>Daily Tasks</h3>
      {allTaskComplete && <p>all tasks are over!!</p>}
      <ul>
        {tasksArray.map((task) => (
          <li key={task.id} style={{ marginBottom: '1rem' }} className='flex justify-between'>
            <div>
              <Checkbox isSelected={task.leetcodeTask} isDisabled>
                Leetcode Task
              </Checkbox>
            </div>
            <div>
              <Checkbox isSelected={task.aiInterviewTask} isDisabled>
                AI Interview Task
              </Checkbox>
            </div>
            <div>
              <Checkbox isSelected={task.aiQuizTask} isDisabled>
                AI Quiz Task
              </Checkbox>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyTasks;
