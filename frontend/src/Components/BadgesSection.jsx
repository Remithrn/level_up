import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';
import { getUserBadges } from '../features/LeetCode/LeetcodeSlice';
import StatsCard from './StatsCard';

const BadgesSection = ({ badges: propBadges }) => {
    const dispatch = useDispatch();
    // Use badges from state if propBadges is not provided
    const { badges: stateBadges } = useSelector((state) => state.leetcode);

    // Use the badges prop if it is provided, otherwise, use the state
    const badges = propBadges || stateBadges;

    useEffect(() => {
        // Only dispatch if badges prop is not provided
        if (!propBadges) {
            dispatch(getUserBadges());
        }
    }, [dispatch, propBadges]);

    return (
        <Card>
            <section>
                <h2 className="mb-5 text-2xl font-bold">Badges</h2>

                <div className="grid grid-cols-2 gap-3">
                    {badges.length > 0 ? (
                        badges.map((badge) => (
                            <StatsCard cols={true} key={badge.id} className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-gray-200 p-4">
                                <img
                                    src={badge.badge_image}
                                    alt={badge.badge_name}
                                    className="w-16 h-16 object-contain"
                                />
                                <span className="text-lg font-semibold">{badge.badge_name}</span>
                                <span className="text-sm text-gray-500">{badge.badge_description}</span>
                            </StatsCard>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center col-span-2">
                            No badges yet
                        </div>
                    )}
                </div>
            </section>
        </Card>
    );
};

export default BadgesSection;
