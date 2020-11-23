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

    [self setupEvents];

//    self.view.backgroundColor = [UIColor yellowColor];
    self.navigationItem.title = @"Events";
    self.navigationController.navigationBar.prefersLargeTitles = YES;

    [self.tableView registerClass:UITableViewCell.class forCellReuseIdentifier:cellId];
}

- (void)setupEvents {
    self.events = NSMutableArray.new;

    Event *event = Event.new;
    event.title = @"Study iOS";
    event.startTime = NSDate.new;
    event.endTime = NSDate.new;
    [self.events addObject:event];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.events.count;
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
