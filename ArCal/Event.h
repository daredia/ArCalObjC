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
@property (strong, nonatomic) NSDate *startTime;
@property (strong, nonatomic) NSDate *endTime;

@end

NS_ASSUME_NONNULL_END
