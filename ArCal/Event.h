//
//  Event.h
//  ArCal
//
//  Created by Shehzad Daredia on 11/23/20.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Event : NSObject

@property (strong, nonatomic) NSString *title;
// GCal's regular events have full datetimes
@property (strong, nonatomic, nullable) NSDate *startTime;
@property (strong, nonatomic, nullable) NSDate *endTime;
// GCal's all-day events have dates but not times
@property (strong, nonatomic, nullable) NSDate *startDate;
@property (strong, nonatomic, nullable) NSDate *endDate;

@end

NS_ASSUME_NONNULL_END
