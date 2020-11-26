//
//  ViewController.m
//  ArCal
//
//  Created by Shehzad Daredia on 11/23/20.
//

#import "ViewController.h"
#import "Event.h"

@interface ViewController ()

@property (strong, nonatomic) NSMutableArray<Event *> *events;

@end

@implementation ViewController

NSString *cellId = @"cellId";

- (void)viewDidLoad {
    [super viewDidLoad];

    [self fetchEvents];

//    self.view.backgroundColor = [UIColor yellowColor];
    self.navigationItem.title = @"Events";
    self.navigationController.navigationBar.prefersLargeTitles = YES;

    [self.tableView registerClass:UITableViewCell.class forCellReuseIdentifier:cellId];
}

- (void)fetchEvents {
    NSLog(@"Fetching events...");

    NSString *urlString = @"https://daredia.github.io/ArCalObjC/sample_gcal_events.json";
    NSURL *url = [NSURL URLWithString:urlString];

    [[NSURLSession.sharedSession dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {

        NSError *err;
        NSDictionary *responseDict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&err];
        if (err) {
            NSLog(@"Failed to serialize into JSON: %@", err);
            return;
        }

        NSArray *responseEvents = responseDict[@"items"];
        self.events = NSMutableArray.new;

        for (NSDictionary *eventDict in responseEvents) {
            NSString *startDate = eventDict[@"start"][@"date"];
            NSString *endDate = eventDict[@"end"][@"date"];
            NSString *startTime = eventDict[@"start"][@"dateTime"];
            NSString *endTime = eventDict[@"end"][@"dateTime"];

            Event *event = Event.new;
            event.title = eventDict[@"summary"];
            event.startDate = [self convertDatetimeStringToNSDate:startDate];
            event.endDate = [self convertDatetimeStringToNSDate:endDate];
            event.startTime = [self convertDatetimeStringToNSDate:startTime];
            event.endTime = [self convertDatetimeStringToNSDate:endTime];
            [self.events addObject:event];
        }

        dispatch_async(dispatch_get_main_queue(), ^{
            [self.tableView reloadData];
        });
    }] resume];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.events.count;
}

/**
 * Converts a date or datetime string to an NSDate object.
 */
- (NSDate *)convertDatetimeStringToNSDate:(NSString *)datetime {
    NSDateFormatter *datetimeFormatter = NSDateFormatter.new;
    [datetimeFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
    [datetimeFormatter setTimeZone:[NSTimeZone systemTimeZone]];
    NSDate *date = [datetimeFormatter dateFromString:datetime];
    if (date != nil) {
        return date;
    }

    NSDateFormatter *dateFormatter = NSDateFormatter.new;
    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
    [dateFormatter setTimeZone:[NSTimeZone systemTimeZone]];
    // TODO(shez): throw or otherwise handle if this is nil
    return [dateFormatter dateFromString:datetime];
}

- (NSString *)getEventCellText:(Event *)event {
    NSString *startTime;
    NSDateFormatter *dateFormatter = NSDateFormatter.new;
    [dateFormatter setDateFormat:@"h:mm"];
    startTime = [dateFormatter stringFromDate:event.startTime];

    NSMutableArray *cellLabelTexts = NSMutableArray.new;
    [cellLabelTexts addObject:startTime];
    [cellLabelTexts addObject:event.title];

    return [cellLabelTexts componentsJoinedByString:@" "];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellId forIndexPath:indexPath];

    Event *event = self.events[indexPath.row];

    cell.backgroundColor = UIColor.lightGrayColor;
    cell.textLabel.text =  [self getEventCellText:event];
    return cell;
}


@end
